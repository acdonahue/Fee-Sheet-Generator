import React, { useEffect, useMemo, useState } from "react";
import {
  hubspot,
  Button,
  LoadingButton,
  Text,
  Flex,
  Image,
  Icon,
  Link,
  Box,
  Divider,
  ButtonRow,
} from "@hubspot/ui-extensions";

type HubSpotContext = {
  crm?: { objectId?: string; recordId?: string };
  objectId?: string;
  user?: { firstName?: string; lastName?: string; email?: string };
};

type HubspotWithActions = {
  actions?: {
    openUrl?: (args: { url: string }) => Promise<void>;
  };
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

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
    timeout: 12_000,
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

function StatusTag({
  label,
  tone = "warning",
}: {
  label: string;
  tone?: "warning" | "muted" | "success" | "error";
}) {
  const stylesByTone: Record<string, { dotColor: string }> = {
    warning: { dotColor: "#F5C26B" },
    muted: { dotColor: "#CBD5E1" },
    success: { dotColor: "#22C55E" },
    error: { dotColor: "#EF4444" },
  };

  const s = stylesByTone[tone] || stylesByTone.warning;
  const dotSrc = useMemo(() => buildDotSvgDataUri(s.dotColor), [s.dotColor]);

  return (
    <Flex direction="row" align="center" gap="xs">
      <Image src={dotSrc} alt="" width={10} />
      <Text variant="microcopy">{label}</Text>
    </Flex>
  );
}

/* ---------- Card ---------- */

function FeeSheetCard({ context }: { context: unknown }) {
  const ctx = context as HubSpotContext;

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [feeSheetUrl, setFeeSheetUrl] = useState("");
  const [feeSheetFileName, setFeeSheetFileName] = useState("");
  const [feeSheetCreatedBy, setFeeSheetCreatedBy] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");
  const [spCreatedAt, setSpCreatedAt] = useState("");
  const [spLastModifiedAt, setSpLastModifiedAt] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  // proposal metadata
  const [readyAt, setReadyAt] = useState("");
  const [readyBy, setReadyBy] = useState("");

  const [isTogglingReady, setIsTogglingReady] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);

  // UI mode: when true, Ready stays disabled + Sync Now appears next to it
  const [proposalSentLocked, setProposalSentLocked] = useState(false);

  const objectId = ctx.crm?.objectId || ctx.crm?.recordId || ctx.objectId || "";

  const createdByForRequest = useMemo(() => {
    const first = ctx.user?.firstName || "";
    const last = ctx.user?.lastName || "";
    return `${first} ${last}`.trim() || ctx.user?.email || "Unknown user";
  }, [ctx.user?.firstName, ctx.user?.lastName, ctx.user?.email]);

  const canOpen = feeSheetUrl.startsWith("http");

  const openFeeSheet = async () => {
    if (!canOpen) return;

    try {
      const hs = hubspot as unknown as HubspotWithActions;
      if (hs.actions?.openUrl) {
        await hs.actions.openUrl({ url: feeSheetUrl });
        return;
      }
    } catch {
      // ignore and fall back
    }

    try {
      if (typeof window !== "undefined" && window?.open) {
        window.open(feeSheetUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
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

    if (proposalSentLocked) {
      return { tone: "success" as const, label: "Ready for proposal" };
    }

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
        ? { tone: "error" as const, label: "Not started" }
        : { tone: "warning" as const, label: "In progress" };
    }

    return { tone: "warning" as const, label: "In progress" };
  };

  const statusDisplay = computeStatus();

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
    setLastSyncedAt(body?.feeSheetLastSyncedAt || "");

    const serverReadyAt =
      body?.fee_sheet_ready_at || body?.feeSheetReadyAt || body?.readyAt || "";
    const serverReadyBy =
      body?.fee_sheet_ready_by || body?.feeSheetReadyBy || body?.readyBy || "";

    setReadyAt(serverReadyAt);
    setReadyBy(serverReadyBy);

    const backendReady = Boolean(body?.readyForProposal);
    setProposalSentLocked(backendReady);
  }

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        await loadFeeSheetMeta();
      } catch (e: unknown) {
        setStatus(`Load error: ${getErrorMessage(e)}`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Auto-poll to tighten up “HubSpot noticing changes”
  // (only while the card is open)
  useEffect(() => {
    if (!canOpen) return;
    if (isLoading) return;

    const POLL_MS = 20_000;

    const id = setInterval(() => {
      // Don’t stomp on active operations
      if (isTogglingReady || isSyncingNow) return;
      loadFeeSheetMeta().catch(() => {
        // silent: keep UI stable
      });
    }, POLL_MS);

    return () => clearInterval(id);
  }, [canOpen, isLoading, isTogglingReady, isSyncingNow, objectId]);

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
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Sync now (pull Excel → deal properties) + refresh meta
  async function onSyncNow() {
    if (isSyncingNow || isTogglingReady || isLoading) return;

    try {
      setIsSyncingNow(true);
      setStatus("Syncing now…");

      const body = await callBackend({
        action: "refresh",
        objectId: String(objectId),
      });

      if (body?.feeSheetLastSyncedAt)
        setLastSyncedAt(body.feeSheetLastSyncedAt);

      setStatus(body?.message || "Synced.");
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    } finally {
      setIsSyncingNow(false);
    }
  }

  // Ready for proposal
  async function onSendProposal() {
    if (isTogglingReady || proposalSentLocked) return;

    try {
      setIsTogglingReady(true);
      setStatus("");

      const body = await callBackend({
        action: "set-ready",
        objectId: String(objectId),
        ready: "true",
        updatedBy: createdByForRequest,
      });

      // Show the backend message + counts (if provided)
      if (body?.lineItemSummary) {
        const s = body.lineItemSummary;
        setStatus(
          `${body?.message || "Ready set."} Line items: +${s.created}, ~${
            s.updated
          }, -${s.deleted}`
        );
      } else {
        setStatus(body?.message || "Ready set.");
      }

      // Lock immediately so UI swaps right away
      setProposalSentLocked(true);

      // Immediately pull latest meta (and show it)
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
    } finally {
      setIsTogglingReady(false);
    }
  }

  // Go back to editing
  async function onGoBackToEditing() {
    if (isTogglingReady) return;

    try {
      setIsTogglingReady(true);
      setStatus("");

      await callBackend({
        action: "set-ready",
        objectId: String(objectId),
        ready: "false",
        updatedBy: createdByForRequest,
      });

      setProposalSentLocked(false);
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      setStatus(`Error: ${getErrorMessage(e)}`);
      setProposalSentLocked(true);
    } finally {
      setIsTogglingReady(false);
    }
  }

  return (
    <Flex direction="column" gap="sm">
      {isLoading ? (
        <Text variant="bodytext">Loading fee sheet…</Text>
      ) : !canOpen ? (
        <Button onClick={onCreate}>Create Fee Sheet</Button>
      ) : (
        <>
          {statusDisplay && (
            <StatusTag label={statusDisplay.label} tone={statusDisplay.tone} />
          )}

          {/* File tile */}
          <Box flex="initial">
            <Flex direction="row" align="baseline" gap="xs">
              <Image src={EXCEL_ICON_URL} alt="Excel" width={32} />
              <Link
                href={{ url: feeSheetUrl, external: true }}
                onClick={openFeeSheet}
              >
                {feeSheetFileName || "Fee Sheet"}
              </Link>
            </Flex>
          </Box>

          {/* Meta block */}
          <Flex direction="column">
            <Flex direction="row" gap="xs" align="baseline">
              <Text variant="microcopy" format={{ fontWeight: "bold" }}>
                {proposalSentLocked ? "Marked ready:" : "Last updated:"}
              </Text>
              <Text variant="microcopy">
                {proposalSentLocked
                  ? relativeTime(readyAt || lastUpdatedAt)
                  : relativeTime(lastUpdatedAt || spLastModifiedAt)}
              </Text>
            </Flex>

            <Flex direction="row" gap="xs" align="baseline">
              <Text variant="microcopy" format={{ fontWeight: "bold" }}>
                {proposalSentLocked ? "Completed by:" : "Created by:"}
              </Text>
              <Text variant="microcopy">
                {proposalSentLocked ? readyBy || "—" : feeSheetCreatedBy || "—"}
              </Text>
            </Flex>
          </Flex>

          <Divider />

          {/* Actions */}
          <Flex direction="column" gap="xs">
            <ButtonRow>
              {!proposalSentLocked ? (
                <LoadingButton
                  variant="primary"
                  onClick={onSendProposal}
                  loading={isTogglingReady}
                  disabled={isLoading || proposalSentLocked || isSyncingNow}
                  resultIconName="success"
                >
                  <Icon name="notification" />
                  Ready for proposal
                </LoadingButton>
              ) : (
                <>
                  {/* Disabled Ready button with SUCCESS icon */}
                  <Button variant="primary" disabled={true}>
                    <Icon name="success" />
                    Ready for proposal
                  </Button>

                  {/* Sync now button (does refresh + reload) */}
                  <LoadingButton
                    variant="secondary"
                    onClick={onSyncNow}
                    loading={isSyncingNow}
                    disabled={isTogglingReady || isLoading}
                    resultIconName="success"
                  >
                    <Icon name="refresh" />
                    Sync now
                  </LoadingButton>

                  <Button
                    variant="transparent"
                    size="xs"
                    onClick={onGoBackToEditing}
                    disabled={isTogglingReady || isSyncingNow}
                  >
                    Reopen for edits
                  </Button>
                </>
              )}
            </ButtonRow>

            {/* Helper line */}
            {proposalSentLocked ? (
              <Flex direction="row" align="baseline" gap="xs">
                <Text variant="microcopy">
                  Last synced: {lastSyncedAt ? relativeTime(lastSyncedAt) : "—"}
                </Text>
              </Flex>
            ) : (
              <Flex direction="row" align="center" gap="xs">
                <Text variant="microcopy">Posts to #proposals</Text>
              </Flex>
            )}
          </Flex>
        </>
      )}

      {status && <Text variant="bodytext">{status}</Text>}
    </Flex>
  );
}

export default FeeSheetCard;
