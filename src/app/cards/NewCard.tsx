import React, { useEffect, useMemo, useState } from "react";
import { hubspot, Button, Text, Flex, Image, Icon } from "@hubspot/ui-extensions";

hubspot.extend(({ context }) => <FeeSheetCard context={context} />);

const BACKEND_ENDPOINT = "https://fee-sheet-backend.onrender.com/api/fee-sheet";
const EXCEL_ICON_URL =
  "https://50802810.fs1.hubspotusercontent-na1.net/hubfs/50802810/File%20type%20icon.svg";

function buildBackendUrl(params: Record<string, string>) {
  const url = new URL(BACKEND_ENDPOINT);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

async function callBackend(params: Record<string, string>) {
  const url = buildBackendUrl(params);

  const res = await hubspot.fetch(url, {
    method: "GET",
    timeout: 20_000,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return res.json();
}

/* ---------- Status ---------- */

function buildDotSvgDataUri(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
    <circle cx="5" cy="5" r="4" fill="${color}" stroke="${color}" stroke-width="2" />
  </svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml,${encoded}`;
}

/** external-link icon as SVG (guaranteed to render) */
function buildExternalIconDataUri(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M10.5 1.5h4v4" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.5 1.5L8.5 7.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.5 3.5H5A2.5 2.5 0 0 0 2.5 6v5A2.5 2.5 0 0 0 5 13.5h5A2.5 2.5 0 0 0 12.5 11v-1.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml,${encoded}`;
}

function StatusTag({
  label,
  tone = "warning",
}: {
  label: string;
  tone?: "warning" | "muted" | "success" | "error";
}) {
  const stylesByTone: Record<string, { dotColor: string; textColor: string }> = {
    warning: { dotColor: "#F5C26B", textColor: "#7C98B6" },
    muted: { dotColor: "#CBD5E1", textColor: "#7C98B6" },
    success: { dotColor: "#22C55E", textColor: "#7C98B6" },
    error: { dotColor: "#EF4444", textColor: "#7C98B6" },
  };

  const s = stylesByTone[tone] || stylesByTone.warning;
  const dotSrc = useMemo(() => buildDotSvgDataUri(s.dotColor), [s.dotColor]);

  return (
    <Flex direction="row" align="center" gap="xs">
      <Image src={dotSrc} alt="" width={10} />
      <Text
        style={{
          fontSize: "12px",
          lineHeight: "22px",
          fontWeight: 300,
          color: s.textColor,
        }}
      >
        {label}
      </Text>
    </Flex>
  );
}

/* ---------- Card ---------- */

function FeeSheetCard({ context }: { context: any }) {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [feeSheetUrl, setFeeSheetUrl] = useState("");
  const [feeSheetFileName, setFeeSheetFileName] = useState("");
  const [feeSheetCreatedBy, setFeeSheetCreatedBy] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");
  const [spCreatedAt, setSpCreatedAt] = useState("");
  const [spLastModifiedAt, setSpLastModifiedAt] = useState("");
  const [readyForProposal, setReadyForProposal] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const objectId =
    context?.crm?.objectId ||
    context?.crm?.recordId ||
    context?.objectId ||
    "";

  const createdByForRequest = useMemo(() => {
    const first = context?.user?.firstName || "";
    const last = context?.user?.lastName || "";
    return `${first} ${last}`.trim() || context?.user?.email || "Unknown user";
  }, [context]);

  const canOpen = feeSheetUrl.startsWith("http");

  const openFeeSheet = async () => {
    if (!canOpen) return;

    const anyHubspot: any = hubspot as any;
    try {
      if (anyHubspot?.actions?.openUrl) {
        await anyHubspot.actions.openUrl({ url: feeSheetUrl });
        return;
      }
    } catch (e) {
      // fall through
    }

    try {
      if (typeof window !== "undefined" && window?.open) {
        window.open(feeSheetUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      setStatus("Could not open file from this card environment.");
    }
  };

  const relativeTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "yesterday" : `${days} days ago`;
  };

  const computeStatus = () => {
    if (!feeSheetUrl) return null;

    const c = new Date(spCreatedAt);
    const m = new Date(spLastModifiedAt);

    if (
      spCreatedAt &&
      spLastModifiedAt &&
      !Number.isNaN(c.getTime()) &&
      !Number.isNaN(m.getTime())
    ) {
      const diff = Math.abs(m.getTime() - c.getTime());
      return diff <= 60_000
        ? { tone: "muted" as const, label: "Not started" }
        : { tone: "warning" as const, label: "In progress" };
    }

    return { tone: "warning" as const, label: "In progress" };
  };

  const statusDisplay = computeStatus();
  const externalIconSrc = useMemo(() => buildExternalIconDataUri("#00A4BD"), []);

  async function loadFeeSheetMeta() {
    const body = await callBackend({
      action: "get",
      objectId: String(objectId),
    });

    setFeeSheetUrl(body?.feeSheetUrl || "");
    setFeeSheetFileName(body?.feeSheetFileName || "");
    setFeeSheetCreatedBy(body?.feeSheetCreatedBy || "");
    setLastUpdatedAt(body?.lastUpdatedAt || "");
    setSpCreatedAt(body?.spCreatedAt || "");
    setSpLastModifiedAt(body?.spLastModifiedAt || "");
    setReadyForProposal(Boolean(body?.readyForProposal));
    setLastSyncedAt(body?.feeSheetLastSyncedAt || "");
  }

  useEffect(() => {
    (async () => {
      try {
        await loadFeeSheetMeta();
      } catch (e: any) {
        setStatus(`Load error: ${e?.message || String(e)}`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function onCreate() {
    try {
      setIsLoading(true);
      setStatus("");

      const body = await callBackend({
        action: "create",
        objectId: String(objectId),
        createdBy: createdByForRequest,
      });

      setStatus(body?.message || "Created.");
      await loadFeeSheetMeta();
    } catch (e: any) {
      setStatus(`Error: ${e?.message || String(e)}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function onToggleReady() {
    try {
      const next = !readyForProposal;
      setReadyForProposal(next);

      await callBackend({
        action: "set-ready",
        objectId: String(objectId),
        ready: next ? "true" : "false",
        updatedBy: createdByForRequest,
      });
    } catch (e: any) {
      setReadyForProposal((v) => !v);
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  }

  async function onRefreshFromExcel() {
    try {
      setStatus("Syncing from fee sheet…");

      const body = await callBackend({
        action: "refresh",
        objectId: String(objectId),
      });

      if (body?.feeSheetLastSyncedAt) {
        setLastSyncedAt(body.feeSheetLastSyncedAt);
      }

      setStatus(body?.message || "Synced.");
      await loadFeeSheetMeta();
    } catch (e: any) {
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  }

  return (
    <Flex direction="column" gap="md" style={{ width: "100%" }}>
      {isLoading ? (
        <Text size="sm">Loading fee sheet…</Text>
      ) : !canOpen ? (
        <Button onClick={onCreate}>Create Fee Sheet</Button>
      ) : (
        <>
          {statusDisplay && (
            <StatusTag label={statusDisplay.label} tone={statusDisplay.tone} />
          )}

          {/* File row */}
          <Flex
            direction="row"
            justify="start"
            align="start"
            gap="sm"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          >
            <Image
              src={EXCEL_ICON_URL}
              alt="Excel"
              width={50}
              style={{ flexShrink: 0 }}
            />

            <Flex
              direction="column"
              gap="xs"
              style={{ width: "100%", flexGrow: 1, minWidth: 0 }}
            >
              {/* Title row: teal "link-like" text + inline open icon */}
              <Flex
                direction="row"
                align="center"
                gap="xs"
                style={{ width: "100%", minWidth: 0 }}
              >
                <Text
                  size="md"
                  format={{ fontWeight: "bold" }}
                  onClick={openFeeSheet}
                  style={{
                    color: "#00A4BD",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                    flexGrow: 1,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.textDecoration = "none";
                  }}
                >
                  {feeSheetFileName || "Fee Sheet"}
                </Text>

                <Image
                  src={externalIconSrc}
                  alt="Open"
                  width={14}
                  style={{ flexShrink: 0, cursor: "pointer" }}
                  onClick={openFeeSheet}
                />
              </Flex>

              {/* Bold label, regular value */}
              <Flex direction="row" gap="xs" align="baseline" style={{ minWidth: 0 }}>
                <Text
                  size="xs"
                  format={{ fontWeight: "bold" }}
                  style={{ color: "#6B7280" }}
                >
                  Last updated:
                </Text>
                <Text size="xs" style={{ color: "#6B7280" }}>
                  {relativeTime(lastUpdatedAt)}
                </Text>
              </Flex>

              <Flex direction="row" gap="xs" align="baseline" style={{ minWidth: 0 }}>
                <Text
                  size="xs"
                  format={{ fontWeight: "bold" }}
                  style={{ color: "#6B7280" }}
                >
                  Created by:
                </Text>
                <Text size="xs" style={{ color: "#6B7280" }}>
                  {feeSheetCreatedBy || "—"}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Actions */}
          <Flex direction="column" gap="xs">
            <Button size="xs" variant="secondary" onClick={onRefreshFromExcel}>
              <Icon name="dataSync" /> Sync fee sheet updates
            </Button>

            <Text size="xs" style={{ color: "#6B7280", lineHeight: "16px" }}>
              Last synced: {lastSyncedAt ? relativeTime(lastSyncedAt) : "—"}
            </Text>

            <Text size="sm" onClick={onToggleReady} format={{ fontWeight: "bold" }}>
              {readyForProposal ? "☑ ready for proposal" : "☐ ready for proposal"}
            </Text>

            <Text size="xs" style={{ color: "#6B7280", marginTop: "-4px" }}>
              🔔 posts to #proposals
            </Text>
          </Flex>
        </>
      )}

      {status && <Text size="sm">{status}</Text>}
    </Flex>
  );
}

export default FeeSheetCard;

