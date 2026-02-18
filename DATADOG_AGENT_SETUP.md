# Datadog Agent Installation Guide

This guide covers installing and configuring the Datadog Agent for monitoring the Asper Beauty Shop infrastructure and applications.

## Overview

The Datadog Agent is a software that runs on your hosts to collect events and metrics and send them to Datadog, where you can analyze your monitoring and performance data. This setup integrates with the [Datadog Webhook Handler](./supabase/functions/datadog-webhook/README.md) already deployed in this project.

## Prerequisites

- Datadog account (sign up at [datadoghq.eu](https://www.datadoghq.eu) for EU region)
- API key from your Datadog account
- Administrative/sudo access to the target system

## Getting Your API Key

1. Log in to your Datadog account at [datadoghq.eu](https://app.datadoghq.eu)
2. Navigate to **Organization Settings** > **API Keys**
3. Copy your existing API key or create a new one
4. **IMPORTANT**: Keep this key secure and never commit it to version control

## Installation Instructions

### Windows (Chocolatey)

For Windows systems using the Chocolatey package manager:

```powershell
# Install Datadog Agent with API key and site configuration
choco install datadog-agent -ia="APIKEY=YOUR_API_KEY SITE=datadoghq.eu"
```

**Example**:
```powershell
choco install datadog-agent -ia="APIKEY=47b91324d89a4e736f4e5e47bf325c32 SITE=datadoghq.eu"
```

**Parameters**:
- `APIKEY`: Your Datadog API key
- `SITE`: Datadog site (use `datadoghq.eu` for EU region, `datadoghq.com` for US)

### Windows (MSI Installer)

Alternative installation method using the MSI installer:

```powershell
# Download the installer
$msiUrl = "https://s3.amazonaws.com/ddagent-windows-stable/datadog-agent-7-latest.amd64.msi"
Invoke-WebRequest -Uri $msiUrl -OutFile "datadog-agent.msi"

# Install with parameters
msiexec /i datadog-agent.msi APIKEY="YOUR_API_KEY" SITE="datadoghq.eu" /qn
```

### Linux (Ubuntu/Debian)

For Ubuntu and Debian-based distributions:

```bash
# Set your API key
DD_API_KEY=YOUR_API_KEY
DD_SITE="datadoghq.eu"

# Download and run the installation script
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"
```

Or using the one-liner with environment variables:

```bash
DD_API_KEY=YOUR_API_KEY DD_SITE="datadoghq.eu" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"
```

### Linux (CentOS/Red Hat)

For CentOS, Red Hat, and RPM-based distributions:

```bash
# Set your API key
DD_API_KEY=YOUR_API_KEY
DD_SITE="datadoghq.eu"

# Download and run the installation script
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script_agent7.sh)"
```

### macOS

For macOS systems:

```bash
# Set your API key
DD_API_KEY=YOUR_API_KEY
DD_SITE="datadoghq.eu"

# Download and run the installation script
bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_mac_os.sh)"
```

### Docker

For containerized environments:

```bash
docker run -d \
  --name dd-agent \
  -e DD_API_KEY=YOUR_API_KEY \
  -e DD_SITE=datadoghq.eu \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc/:/host/proc/:ro \
  -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
  gcr.io/datadoghq/agent:7
```

**Docker Compose**:

```yaml
version: '3'
services:
  datadog:
    image: gcr.io/datadoghq/agent:7
    container_name: dd-agent
    environment:
      - DD_API_KEY=YOUR_API_KEY
      - DD_SITE=datadoghq.eu
      - DD_LOGS_ENABLED=true
      - DD_APM_ENABLED=true
      - DD_APM_NON_LOCAL_TRAFFIC=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
```

### Kubernetes

For Kubernetes clusters using Helm:

```bash
# Add the Datadog Helm repository
helm repo add datadog https://helm.datadoghq.com
helm repo update

# Install the Datadog Agent
helm install datadog-agent datadog/datadog \
  --set datadog.apiKey=YOUR_API_KEY \
  --set datadog.site=datadoghq.eu \
  --set datadog.logs.enabled=true \
  --set datadog.apm.enabled=true
```

## Configuration

### Basic Configuration

After installation, the agent configuration file is located at:

- **Windows**: `C:\ProgramData\Datadog\datadog.yaml`
- **Linux**: `/etc/datadog-agent/datadog.yaml`
- **macOS**: `~/.datadog-agent/datadog.yaml`

### Example Configuration

```yaml
# /etc/datadog-agent/datadog.yaml

# Datadog API key (REQUIRED)
api_key: YOUR_API_KEY

# Datadog site (default: datadoghq.com)
site: datadoghq.eu

# Enable log collection
logs_enabled: true

# Enable APM (Application Performance Monitoring)
apm_config:
  enabled: true

# Tags to apply to all metrics
tags:
  - env:production
  - project:asper-beauty-shop
  - platform:lovable
```

### Environment-Specific Tags

Add tags to identify your environments:

**Production**:
```yaml
tags:
  - env:production
  - service:asper-beauty-shop
  - domain:www.asperbeautyshop.com
```

**Staging/Development**:
```yaml
tags:
  - env:staging
  - service:asper-beauty-shop
  - domain:asperbeautyshop.lovable.app
```

## Verification

### Check Agent Status

**Windows**:
```powershell
& "$env:ProgramFiles\Datadog\Datadog Agent\bin\agent.exe" status
```

**Linux/macOS**:
```bash
sudo datadog-agent status
```

**Docker**:
```bash
docker exec dd-agent agent status
```

### Verify Connection

1. Run the status command to check connectivity
2. Look for "API Keys status" section showing "API key ending with ....: API Key valid"
3. Check the Datadog dashboard at [app.datadoghq.eu](https://app.datadoghq.eu) for incoming metrics

### Test Metrics

Send a test metric to verify the agent is working:

```bash
# Linux/macOS
echo -n "custom.metric.name:1|c" | nc -u -w1 localhost 8125

# Windows (PowerShell)
$udpClient = New-Object System.Net.Sockets.UdpClient
$data = [System.Text.Encoding]::ASCII.GetBytes("custom.metric.name:1|c")
$udpClient.Send($data, $data.Length, "localhost", 8125)
$udpClient.Close()
```

## Integration with Webhook Handler

This agent works in conjunction with the [Datadog Webhook Handler](./supabase/functions/datadog-webhook/README.md) deployed in this project:

1. **Agent** → Collects metrics and sends to Datadog
2. **Datadog Monitors** → Trigger alerts based on metrics
3. **Webhook Handler** → Receives alert notifications via webhook
4. **Your Application** → Processes alerts (send notifications, create tickets, etc.)

### Configure Monitors

In Datadog dashboard, create monitors that use the webhook:

1. Navigate to **Monitors** > **New Monitor**
2. Set up your metric conditions (e.g., high error rate, slow response time)
3. In the "Notify your team" section, select your webhook
4. The webhook will be called when the monitor triggers

## Security Best Practices

### API Key Management

1. **Never commit API keys to version control**
   - Use environment variables
   - Use secrets management tools (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Add to `.gitignore`: `*.key`, `secrets.*`, `.env.local`

2. **Rotate API keys regularly**
   - Create new keys in Datadog dashboard
   - Update all agent configurations
   - Delete old keys after verification

3. **Use separate keys for different environments**
   - Different keys for production, staging, development
   - Easier to track and revoke if compromised

### Environment Variables

**Linux/macOS** (add to `.bashrc` or `.zshrc`):
```bash
export DD_API_KEY="your-api-key-here"
export DD_SITE="datadoghq.eu"
```

**Windows** (PowerShell):
```powershell
[Environment]::SetEnvironmentVariable("DD_API_KEY", "your-api-key-here", "User")
[Environment]::SetEnvironmentVariable("DD_SITE", "datadoghq.eu", "User")
```

**Docker/Kubernetes**:
Use Kubernetes secrets or Docker secrets:

```bash
# Create Kubernetes secret
kubectl create secret generic datadog-secret \
  --from-literal=api-key=YOUR_API_KEY

# Reference in deployment
env:
  - name: DD_API_KEY
    valueFrom:
      secretKeyRef:
        name: datadog-secret
        key: api-key
```

### Network Security

1. **Firewall Rules**:
   - Outbound HTTPS (443) to `*.datadoghq.eu`
   - No inbound ports needed for agent

2. **Proxy Configuration** (if required):
   ```yaml
   # datadog.yaml
   proxy:
     https: http://proxy.example.com:3128
   ```

## Monitoring Recommendations for Asper Beauty Shop

### Key Metrics to Monitor

1. **Frontend Performance**:
   - Page load time
   - Time to interactive
   - Core Web Vitals (LCP, FID, CLS)

2. **API Performance**:
   - Shopify API response time
   - Supabase function execution time
   - Error rates

3. **Infrastructure**:
   - CPU usage
   - Memory usage
   - Disk I/O

4. **Business Metrics**:
   - Cart abandonment rate
   - Checkout completion rate
   - Product view to add-to-cart conversion

### Recommended Integrations

1. **Browser Real User Monitoring (RUM)**:
   - Track actual user experience
   - Identify performance bottlenecks
   - Monitor JavaScript errors

2. **Synthetic Monitoring**:
   - Test critical user journeys
   - Monitor uptime
   - Alert on failures

3. **Log Management**:
   - Centralize application logs
   - Track errors and warnings
   - Correlate with metrics

## Troubleshooting

### Agent Not Starting

**Check logs**:
- Windows: `C:\ProgramData\Datadog\logs\agent.log`
- Linux: `/var/log/datadog/agent.log`
- Docker: `docker logs dd-agent`

**Common issues**:
1. Invalid API key → Check key in Datadog dashboard
2. Network connectivity → Verify firewall/proxy settings
3. Permissions → Run as administrator/root

### No Metrics in Datadog

1. **Verify agent is running**:
   ```bash
   sudo systemctl status datadog-agent  # Linux
   Get-Service datadogagent             # Windows
   ```

2. **Check agent status**:
   - Look for "Forwarder" section
   - Verify "Running" status
   - Check for connection errors

3. **Verify API key and site**:
   - Ensure correct API key
   - Confirm site matches your Datadog account (eu vs com)

### High Resource Usage

If the agent uses too much CPU/memory:

1. **Adjust check intervals**:
   ```yaml
   # datadog.yaml
   check_runners: 4  # Reduce concurrent checks
   ```

2. **Disable unused integrations**:
   - Remove check configurations you don't need
   - Disable log collection if not required

3. **Adjust log collection**:
   ```yaml
   logs_config:
     logs_dd_url: intake.logs.datadoghq.eu:10516
     use_compression: true
     compression_level: 6
   ```

## Upgrading the Agent

### Windows (Chocolatey)

```powershell
choco upgrade datadog-agent
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install --only-upgrade datadog-agent

# CentOS/Red Hat
sudo yum update datadog-agent
```

### Docker

```bash
# Pull latest image
docker pull gcr.io/datadoghq/agent:7

# Restart container
docker restart dd-agent
```

## Uninstallation

### Windows (Chocolatey)

```powershell
choco uninstall datadog-agent
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get remove datadog-agent

# CentOS/Red Hat
sudo yum remove datadog-agent
```

### Docker

```bash
docker stop dd-agent
docker rm dd-agent
```

## Additional Resources

- [Official Datadog Agent Documentation](https://docs.datadoghq.com/agent/)
- [Datadog EU Region](https://docs.datadoghq.com/getting_started/site/)
- [Datadog Webhook Integration](https://docs.datadoghq.com/integrations/webhooks/)
- [Datadog API Keys Management](https://docs.datadoghq.com/account_management/api-app-keys/)
- [Datadog Webhook Handler (This Project)](./supabase/functions/datadog-webhook/README.md)

## Support

For issues specific to Asper Beauty Shop monitoring:
- **Email**: asperpharma@gmail.com
- **GitHub Issues**: [Report a problem](https://github.com/asperpharma/Asper-Beauty-Shop-aff332b2/issues)

For Datadog platform issues:
- [Datadog Support](https://help.datadoghq.com/)
- [Datadog Community](https://datadoghq.com/community/)

---

**Last Updated**: February 2026  
**Maintained by**: Asper Beauty Shop Team
