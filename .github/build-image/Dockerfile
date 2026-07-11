ARG PLAYWRIGHT_VERSION=1.61.1
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

ARG NODE_VERSION=24.18.0
# renovate: datasource=github-releases depName=rhysd/actionlint
ARG ACTIONLINT_VERSION=1.7.12
# renovate: datasource=npm depName=markdownlint-cli
ARG MARKDOWNLINT_VERSION=0.49.0
# renovate: datasource=npm depName=renovate
ARG RENOVATE_VERSION=43.259.2
# renovate: datasource=pypi depName=yamllint
ARG YAMLLINT_VERSION=1.38.0

LABEL org.opencontainers.image.source="https://github.com/timmo001/home-assistant-demo-starter"

RUN apt-get update \
    && apt-get install --yes --no-install-recommends python3-pip xz-utils \
    && curl --silent --location \
      "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
      | tar --extract --xz --strip-components=1 --directory /usr/local \
    && pip3 install --break-system-packages --no-cache-dir "yamllint==${YAMLLINT_VERSION}" \
    && curl --silent --location \
      "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz" \
      | tar --extract --gzip --directory /usr/local/bin actionlint \
    && npm install --global \
      "markdownlint-cli@${MARKDOWNLINT_VERSION}" \
      "renovate@${RENOVATE_VERSION}" \
    && npm cache clean --force \
    && rm -rf /var/lib/apt/lists/*
