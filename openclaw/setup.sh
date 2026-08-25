#!/usr/bin/env bash
# OpenClaw setup for the aklisira WhatsApp channel.
# Run as root/ubuntu (with sudo) on a fresh Ubuntu 24.04 server — including Oracle Cloud's
# Always Free ARM (Ampere A1) shape, which this installer supports natively (arch-detected,
# installs via Node/npm rather than an architecture-specific binary).
# Paste into the provider's web console, or SSH in and run it there.
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
