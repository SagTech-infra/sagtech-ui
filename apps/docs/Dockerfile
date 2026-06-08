# syntax=docker/dockerfile:1
#
# Docker image for apps/docs (@sagtech-infra/docs) — the Next.js 16 showcase that
# serves ui.sagtech.io. Build context is the REPO ROOT (`context: .`).
#
# Repo layout note: the component library (@sagtech-infra/ui) IS the root package
# (there is no packages/ui). apps/docs consumes it via `link:../..`, so the build
# must compile the root library first, then the Next app in standalone mode.

# ── base ──────────────────────────────────────────────────────────────────────
# Next 16 requires Node >=20.9. pnpm pinned to the repo's `packageManager`.
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# ── deps ──────────────────────────────────────────────────────────────────────
# Install the whole workspace from manifests only — this layer stays cached
# until a package.json / lockfile changes. Workspace members: root (the library)
# + apps/docs.
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/docs/package.json ./apps/docs/
RUN pnpm install --frozen-lockfile

# ── builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/docs/node_modules ./apps/docs/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# 1) Build the library at the repo root (root pkg's `build` = tsup → /app/dist).
#    Invoked by script, not package name, so an upstream package rename (e.g.
#    @sagtech-infra/ui → @sagtech_llc/ui) can't break it. apps/docs consumes the
#    output via the `link:../..` symlink under its import alias @sagtech-infra/ui.
RUN pnpm build
# 2) Build the Next app in standalone mode (output configured in next.config.ts).
RUN pnpm --filter @sagtech-infra/docs build

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# In a pnpm monorepo the standalone bundle is rooted at the monorepo root, so
# server.js lands at apps/docs/server.js (NOT ./server.js). Copy the traced
# bundle, then the static assets and public dir into their app-nested paths.
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/docs/server.js"]
