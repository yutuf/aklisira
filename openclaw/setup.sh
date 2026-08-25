#!/usr/bin/env bash
# OpenClaw setup for the aklisira WhatsApp channel.
# Run as root on a fresh Ubuntu 24.04 server (paste into the provider's web console).
set -euo pipefail

apt-get update -y
apt-get install -y curl ca-certificates

# Official installer (per openclaw/openclaw README)
curl -fsSL https://openclaw.ai/install.sh | bash

echo "== Next steps (interactive) =="
echo "1. Run: openclaw onboard --install-daemon"
echo "   - This verifies model access (asks for your ANTHROPIC_API_KEY), creates the workspace,"
echo "     and configures the Gateway."
echo "2. Add the WhatsApp channel through onboarding, or: openclaw channel add whatsapp"
echo "   - This triggers QR pairing — scan it with the aklisira WhatsApp Business number's app"
echo "     (Linked Devices, same as WhatsApp Web)."
echo "3. Check status: openclaw gateway status"
echo "4. openclaw dashboard   # local web dashboard, may need port-forwarding to view remotely"
