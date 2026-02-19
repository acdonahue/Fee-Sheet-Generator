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
  Tooltip,
  Tile,
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

type AddAlertFn = (args: {
  message: string;
  type?: "info" | "success" | "warning" | "danger";
  title?: string;
}) => void;

type ApiWithAddAlert = {
  context: unknown;
  actions?: {
    addAlert?: AddAlertFn;
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

/**
 * ✅ FIX: Do NOT type destructured args.
 * HubSpot api/actions types are unions across extension points.
 * Accept `api`, then safely narrow to `addAlert`.
 */
hubspot.extend((api) => {
  const { context, actions } = api as unknown as ApiWithAddAlert;
  return <FeeSheetCard context={context} addAlert={actions?.addAlert} />;
});

const BACKEND_ENDPOINT = "https://fee-sheet-backend.onrender.com/api/fee-sheet";
const EXCEL_ICON_URL =
  "https://50802810.fs1.hubspotusercontent-na1.net/hubfs/50802810/file.png";

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
    <Flex direction="row" align="baseline" gap="xs">
      <Image src={dotSrc} alt="" width={10} />
      <Text variant="microcopy" format={{ fontWeight: "bold" }}>
        {label}
      </Text>
    </Flex>
  );
}

/* ---------- Card ---------- */

function FeeSheetCard({
  context,
  addAlert,
}: {
  context: unknown;
  addAlert?: AddAlertFn;
}) {
  const ctx = context as HubSpotContext;

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [feeSheetUrl, setFeeSheetUrl] = useState("");
  const [feeSheetFileName, setFeeSheetFileName] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  // proposal metadata
  const [readyAt, setReadyAt] = useState("");
  const [readyBy, setReadyBy] = useState("");

  const [isTogglingReady, setIsTogglingReady] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [proposalSentLocked, setProposalSentLocked] = useState(false);

  const objectId = ctx.crm?.objectId || ctx.crm?.recordId || ctx.objectId || "";

  const currentUserName = useMemo(() => {
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
      }
    } catch {
      // openUrl not available in this card context
    }
  };

  const alert = (
    type: "success" | "danger" | "info" | "warning",
    message: string,
    title?: string
  ) => {
    if (addAlert) addAlert({ type, message, title });
  };

  const relativeTime = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "yesterday" : `${days} days ago`;
  };

  const computeStatus = () => {
    if (!feeSheetUrl) return null;
    if (proposalSentLocked) {
      return { tone: "success" as const, label: "Ready for proposal" };
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
    setLastUpdatedAt(body?.lastUpdatedAt || "");
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

  // Auto-poll
  useEffect(() => {
    if (!canOpen) return;
    if (isLoading) return;

    const POLL_MS = 20_000;

    const id = setInterval(() => {
      if (isTogglingReady || isSyncingNow || isDeleting) return;
      loadFeeSheetMeta().catch(() => {
        // silent
      });
    }, POLL_MS);

    return () => clearInterval(id);
  }, [canOpen, isLoading, isTogglingReady, isSyncingNow, isDeleting, objectId]);

  async function onCreate() {
    try {
      setIsLoading(true);
      setStatus("");

      const body = await callBackend({
        action: "create",
        objectId: String(objectId),
        createdBy: currentUserName,
      });

      alert("success", body?.message || "Fee Sheet created.", "Created");
      setStatus("");
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      alert("danger", msg, "Create failed");
      setStatus(`Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSyncNow() {
    if (isSyncingNow || isTogglingReady || isLoading || isDeleting) return;

    try {
      setIsSyncingNow(true);
      setStatus("");

      const body = await callBackend({
        action: "refresh",
        objectId: String(objectId),
        updatedBy: currentUserName,
      });

      alert("success", body?.message || "Synced successfully.", "Sync complete");
      setStatus("");
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      alert("danger", msg, "Sync failed");
      setStatus(`Error: ${msg}`);
    } finally {
      setIsSyncingNow(false);
    }
  }

  async function onSendProposal() {
    if (isTogglingReady || proposalSentLocked || isDeleting) return;

    try {
      setIsTogglingReady(true);
      setStatus("");

      const body = await callBackend({
        action: "set-ready",
        objectId: String(objectId),
        ready: "true",
        updatedBy: currentUserName,
      });

      alert("success", body?.message || "Approved for proposal.", "Approved");
      setProposalSentLocked(true);
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      alert("danger", msg, "Approval failed");
      setStatus(`Error: ${msg}`);
    } finally {
      setIsTogglingReady(false);
    }
  }

  async function onGoBackToEditing() {
    if (isTogglingReady || isDeleting) return;

    try {
      setIsTogglingReady(true);
      setStatus("");

      await callBackend({
        action: "set-ready",
        objectId: String(objectId),
        ready: "false",
        updatedBy: currentUserName,
      });

      alert("success", "Fee Sheet reopened for editing.", "Unlocked");
      setProposalSentLocked(false);
      await loadFeeSheetMeta();
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      alert("danger", msg, "Unlock failed");
      setStatus(`Error: ${msg}`);
      setProposalSentLocked(true);
    } finally {
      setIsTogglingReady(false);
    }
  }

  async function onDeleteFeeSheet() {
    if (isDeleting || isLoading || isSyncingNow || isTogglingReady) return;

    try {
      setIsDeleting(true);
      setStatus("");

      const body = await callBackend({
        action: "detach", // backend must support this
        objectId: String(objectId),
        updatedBy: currentUserName,
      });

      alert("success", body?.message || "Fee Sheet detached.", "Detached");
      setProposalSentLocked(false);
      await loadFeeSheetMeta(); // flips UI to Create if url cleared
    } catch (e: unknown) {
      const msg = getErrorMessage(e);
      alert("danger", msg, "Detach failed");
      setStatus(`Error: ${msg}`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Flex direction="column" gap="xs">
      {isLoading ? (
        <Text variant="bodytext">Loading…</Text>
      ) : !canOpen ? (
        <Button variant="primary" onClick={onCreate}>
          Create Fee Sheet
        </Button>
      ) : (
        <>
          <Flex direction="column" gap="xs">
            {/* Status + header actions */}
            <Flex direction="column" gap="flush" justify="start">
              <Flex direction="row" align="center" justify="between">
                {statusDisplay && (
                  <StatusTag
                    label={statusDisplay.label}
                    tone={statusDisplay.tone}
                  />
                )}

                <Flex direction="row" align="center" gap="xs">
                  {/* Only show "Unlock" when locked */}
                  {proposalSentLocked && (
                    <Button
                      variant="transparent"
                      size="md"
                      onClick={onGoBackToEditing}
                      disabled={isTogglingReady || isSyncingNow || isDeleting}
                      overlay={<Tooltip placement="top">Unlock</Tooltip>}
                    >
                      <Icon name="edit" />
                    </Button>
                  )}

                  {/* Always show Detach when a fee sheet exists */}
                  <Button
                    variant="transparent"
                    size="md"
                    onClick={onDeleteFeeSheet}
                    disabled={isDeleting || isTogglingReady || isSyncingNow || isLoading}
                    overlay={<Tooltip placement="top">Detach</Tooltip>}
                  >
                    <Icon name="delete" />
                  </Button>
                </Flex>
              </Flex>

              {proposalSentLocked && (
                <Text variant="microcopy">
                  Approved by{" "}
                  <Text inline variant="microcopy" format={{ italic: true }}>
                    {readyBy || "—"}
                  </Text>
                  ,{" "}
                  <Text inline variant="microcopy" format={{ italic: true }}>
                    {relativeTime(readyAt || lastUpdatedAt)}
                  </Text>
                </Text>
              )}
            </Flex>

            {/* File tile */}
            <Tile compact={true}>
              <Flex direction="row" align="baseline" gap="sm" justify="start">
                <Image src={EXCEL_ICON_URL} alt="Excel" width={34} />
                <Link
                  variant="primary"
                  href={{ url: feeSheetUrl, external: true }}
                  onClick={openFeeSheet}
                >
                  {feeSheetFileName || "Fee Sheet"}
                </Link>
              </Flex>
            </Tile>

            {/* Actions */}
            <Flex direction="column" gap="xs">
              <ButtonRow>
                {!proposalSentLocked && (
                  <LoadingButton
                    variant="primary"
                    size="md"
                    onClick={onSendProposal}
                    loading={isTogglingReady}
                    disabled={isLoading || proposalSentLocked || isSyncingNow || isDeleting}
                    resultIconName="success"
                  >
                    <Icon name="notification" />
                    Approve
                  </LoadingButton>
                )}
              </ButtonRow>

              {proposalSentLocked ? (
                <Flex direction="column" gap="xs">
                  <Flex direction="row" align="center" justify="start" gap="xs">
                    <LoadingButton
                      variant="secondary"
                      size="xs"
                      onClick={onSyncNow}
                      loading={isSyncingNow}
                      disabled={isTogglingReady || isLoading || isDeleting}
                      resultIconName="success"
                      overlay={<Tooltip placement="top">Resync</Tooltip>}
                    >
                      <Icon name="refresh" />
                    </LoadingButton>

                    <Text variant="microcopy">
                      Last synced: {lastSyncedAt ? relativeTime(lastSyncedAt) : "never"}
                    </Text>
                  </Flex>
                </Flex>
              ) : (
                <Flex direction="row" align="baseline" gap="xs">
                  <Text variant="microcopy">Sends a Slack notification</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </>
      )}

      {/* Keep inline status only for errors */}
      {status && <Text variant="bodytext">{status}</Text>}
    </Flex>
  );
}

export default FeeSheetCard;
