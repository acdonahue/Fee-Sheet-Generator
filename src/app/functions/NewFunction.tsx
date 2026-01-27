import React, { useEffect, useMemo, useState } from "react";
import { hubspot, Button, Text, Flex, Link, Image } from "@hubspot/ui-extensions";

hubspot.extend(({ context }) => <FeeSheetCard context={context} />);

function FeeSheetCard({ context }: { context: any }) {
  const [status, setStatus] = useState("");

  const [feeSheetUrl, setFeeSheetUrl] = useState("");
  const [feeSheetCreatedBy, setFeeSheetCreatedBy] = useState("");
  const [feeSheetFileName, setFeeSheetFileName] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  const [spCreatedAt, setSpCreatedAt] = useState("");
  const [spLastModifiedAt, setSpLastModifiedAt] = useState("");

  // Ready-for-proposal fields
  const [readyForProposal, setReadyForProposal] = useState(false);
  const [readyBy, setReadyBy] = useState("");
  const [readyAt, setReadyAt] = useState("");

  const createdByForRequest = useMemo(() => {
    const first = context?.user?.firstName || "";
    const last = context?.user?.lastName || "";
    const full = `${first} ${last}`.trim();
    return full || context?.user?.email || "Unknown user";
  }, [context]);

  const getBody = (result: any) =>
    result?.response?.body || result?.body || result || {};

  const relativeTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const mins = Math.floor((Date.now() - d.getTime()) / 60000);

if (mins < 2) return "just now";

if (mins < 60) {
  return `${mins} minute${mins === 1 ? "" : "s"} ago`;
}

const hours = Math.floor(mins / 60);

if (hours < 24) {
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

const days = Math.floor(hours / 24);

return `${days} day${days === 1 ? "" : "s"} ago`;

  };

  // Phase 1 status logic + override if readyForProposal
  const computeStatus = () => {
    if (!feeSheetUrl) return null;

    // If marked ready, override
    if (readyForProposal) {
      return { dot: "🟢", label: "ready for proposal" };
    }

    const c = new Date(spCreatedAt);
    const m = new Date(spLastModifiedAt);

    if (
      spCreatedAt &&
      spLastModifiedAt &&
      !Number.isNaN(c.getTime()) &&
      !Number.isNaN(m.getTime())
    ) {
      const diffMs = Math.abs(m.getTime() - c.getTime());
      if (diffMs <= 60_000) {
        return { dot: "🔴", label: "not started" };
      }
      return { dot: "🟡", label: "in progress" };
    }

    return { dot: "🟡", label: "in progress" };
  };

  const pill = computeStatus();

  async function loadFeeSheetMeta() {
    const result = await hubspot.serverless("FeeSheetGenerator_app_function", {
      propertiesToSend: ["hs_object_id"],
      parameters: { action: "get" },
    });

    const body = getBody(result);

    setFeeSheetUrl(body?.feeSheetUrl || "");
    setFeeSheetCreatedBy(body?.feeSheetCreatedBy || "");
    setFeeSheetFileName(body?.feeSheetFileName || "");
    setLastUpdatedAt(body?.lastUpdatedAt || "");

    setSpCreatedAt(body?.spCreatedAt || "");
    setSpLastModifiedAt(body?.spLastModifiedAt || "");

    setReadyForProposal(Boolean(body?.feeSheetReadyForProposal));
    setReadyBy(body?.feeSheetReadyBy || "");
    setReadyAt(body?.feeSheetReadyAt || "");
  }

  useEffect(() => {
    loadFeeSheetMeta().catch((e: any) => {
      setStatus(`Load error: ${e?.message || String(e)}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate() {
    try {
      setStatus("Creating…");

      const result = await hubspot.serverless("FeeSheetGenerator_app_function", {
        propertiesToSend: ["hs_object_id"],
        parameters: { action: "create", createdBy: createdByForRequest },
      });

      const body = getBody(result);
      setStatus(body?.message || "Created.");

      await loadFeeSheetMeta();
    } catch (e: any) {
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  }

  const canOpen = typeof feeSheetUrl === "string" && feeSheetUrl.trim().startsWith("http");

  async function toggleReady() {
    try {
      setStatus(readyForProposal ? "Switching back to editing…" : "Marking ready…");

      const result = await hubspot.serverless("FeeSheetGenerator_app_function", {
        propertiesToSend: ["hs_object_id"],
        parameters: {
          action: "setReady",
          ready: String(!readyForProposal),
          readyBy: createdByForRequest,
        },
      });

      const body = getBody(result);
      setStatus(body?.message || "Updated.");

      // Refresh all fields
      await loadFeeSheetMeta();
    } catch (e: any) {
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  }

  return (
    <Flex direction="column" gap="sm">
      {!canOpen ? (
        <Button onClick={onCreate}>Create Fee Sheet</Button>
      ) : (
        <>
          {/* Status pill (left/top) */}
          {pill ? (
            <Text variant="microcopy" format={{ fontWeight: "bold" }}>
              {pill.dot} {pill.label}
            </Text>
          ) : null}

          {/* Thumbnail preview (clickable) */}
          <a href={feeSheetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
            <Image
              src="https://50802810.fs1.hubspotusercontent-na1.net/hubfs/50802810/FSG%20thumb%203.png"
              alt="Fee Sheet preview"
              width={150}
            />
          </a>

          {/* File name (clickable) */}
          <a href={feeSheetUrl} target="_blank" rel="noopener noreferrer">
            {feeSheetFileName || "Open Fee Sheet"}
          </a>

          <Text variant="microcopy">Created by: {feeSheetCreatedBy || "—"}</Text>
          <Text variant="microcopy">Last updated: {relativeTime(lastUpdatedAt)}</Text>

          {/* ✅ Checkbox / toggle ONLY after fee sheet exists */}
          <Flex direction="column" gap="xs">
            <Button onClick={toggleReady}>
              {readyForProposal ? "☑ ready for proposal" : "☐ ready for proposal"}
            </Button>
            <Text variant="microcopy">🔔 posts to Slack</Text>

            {/* Optional: show who/when it was marked ready */}
            {readyForProposal ? (
              <Text variant="microcopy">
                Marked ready by: {readyBy || "—"} {readyAt ? `(${relativeTime(readyAt)})` : ""}
              </Text>
            ) : null}
          </Flex>
        </>
      )}

      {status ? <Text variant="microcopy">{status}</Text> : null}
    </Flex>
  );
}

export default FeeSheetCard;
