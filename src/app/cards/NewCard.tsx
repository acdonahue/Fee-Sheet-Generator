import React, { useEffect, useMemo, useState } from "react";
import { hubspot, Button, Text, Flex, Link, Image } from "@hubspot/ui-extensions";

hubspot.extend(({ context }) => <FeeSheetCard context={context} />);

function FeeSheetCard({ context }: { context: any }) {
  const [status, setStatus] = useState<string>("");

  const [feeSheetUrl, setFeeSheetUrl] = useState<string>("");
  const [feeSheetCreatedBy, setFeeSheetCreatedBy] = useState<string>("");
  const [feeSheetFileName, setFeeSheetFileName] = useState<string>("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("");

  const [spCreatedAt, setSpCreatedAt] = useState<string>("");
  const [spLastModifiedAt, setSpLastModifiedAt] = useState<string>("");

  const getBody = (result: any) =>
    result?.response?.body || result?.body || result || {};

  const createdByForRequest = useMemo(() => {
    const first = context?.user?.firstName || "";
    const last = context?.user?.lastName || "";
    const full = `${first} ${last}`.trim();
    return full || context?.user?.email || "Unknown user";
  }, [context]);

  const relativeTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const ms = Date.now() - d.getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    return `${days} days ago`;
  };

  // Phase 1 status logic
  const computePhase1Status = () => {
    if (!feeSheetUrl) return null;

    const c = new Date(spCreatedAt);
    const m = new Date(spLastModifiedAt);

    const hasSpTimes =
      spCreatedAt &&
      spLastModifiedAt &&
      !Number.isNaN(c.getTime()) &&
      !Number.isNaN(m.getTime());

    if (hasSpTimes) {
      const diffMs = Math.abs(m.getTime() - c.getTime());
      const NOT_STARTED_THRESHOLD_MS = 60 * 1000;

      if (diffMs <= NOT_STARTED_THRESHOLD_MS) {
        return { dot: "🔴", label: "not started" };
      }
      return { dot: "🟡", label: "in progress" };
    }

    if (lastUpdatedAt) {
      return { dot: "🟡", label: "in progress" };
    }

    return { dot: "⚪", label: "status unknown" };
  };

  const pill = computePhase1Status();

  const loadFeeSheetMeta = async () => {
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
  };

  useEffect(() => {
    loadFeeSheetMeta().catch((e) => {
      setStatus(`Load error: ${e?.message || String(e)}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async () => {
    try {
      setStatus("Creating…");

      const result = await hubspot.serverless("FeeSheetGenerator_app_function", {
        propertiesToSend: ["hs_object_id"],
        parameters: { action: "create", createdBy: createdByForRequest },
      });

      const body = getBody(result);
      setStatus(body?.message || "Saved.");

      await loadFeeSheetMeta();
    } catch (e: any) {
      setStatus(`Function error: ${e?.message || String(e)}`);
    }
  };

  const canOpen =
    typeof feeSheetUrl === "string" && feeSheetUrl.trim().startsWith("http");

  return (
    <Flex direction="column" gap="sm">
      {canOpen ? (
        <>
          {/* Status pill */}
          {pill ? (
            <Text size="sm" format={{ fontWeight: "bold" }}>
              {pill.dot} {pill.label}
            </Text>
          ) : null}

          {/* Clickable thumbnail */}
          <Link href={feeSheetUrl} openInNewTab>
            <Image
              src="https://50802810.fs1.hubspotusercontent-na1.net/hubfs/50802810/FSG%20thumb%2011@4x.png"
              alt="Fee Sheet preview"
              width={200}
            />
          </Link>

          {/* File name link */}
          <Link href={feeSheetUrl} openInNewTab>
            {feeSheetFileName || "Open Fee Sheet"}
          </Link>

          <Text size="sm">Created by: {feeSheetCreatedBy || "—"}</Text>
          <Text size="sm">Last updated: {relativeTime(lastUpdatedAt)}</Text>
        </>
      ) : (
        <Button onClick={onCreate}>Create Fee Sheet</Button>
      )}

      {status ? <Text size="sm">{status}</Text> : null}
    </Flex>
  );
}

export default FeeSheetCard;

