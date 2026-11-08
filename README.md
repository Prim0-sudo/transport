# Transport Town

Static teacher-led transport game. Current v6 upgrade: [handoff](HANDOFF.md) and [gap inventory](docs/V6-UPGRADE-2026-11-08.md).

Run `npm start` to start or reuse the supervised local source preview at http://127.0.0.1:4251/. Run `npm run preview:status` for workspace identity and health. Node built-ins only; no dependency installation or build required.

The runtime source is `site/dist/`. This inherited directory name does not imply a separate built copy. Preview tooling injects local live reload only in HTTP responses; files remain static and deployment-ready for a later authorized release. No deployment is authorized by this README.

Repository: https://github.com/Prim0-sudo/transport. Pages project identifier: `transport`; existing public URL remains https://transport-town-7b0.pages.dev/. See [operational identities](docs/HOSTING-AND-NAMING.md).

Shared-shell visual review: http://127.0.0.1:4251/review/ (review-only source outside site/dist; final assets pending approval).
