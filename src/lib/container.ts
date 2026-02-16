export type AppInstance = {
  id: string;
  name: string;
  status: string;
};

export type ContainerInstance = {
  id: string;
  instanceId: string;
  state: string;
};

export type FlyFile = {
  guest_path: string;
  raw_value: string;
};

const FLY_API_HOSTNAME_DEFAULT = "https://api.machines.dev";

export const INIT_CMD = [
  "sh",
  "-c",
  "cd /app && bun install && exec bun --hot run src/main.ts",
];

// biome-ignore format: alinment
type FlyConfig = {
  token:        string;
  hostname:     string;
  image:        string;
  region:       string;
  orgSlug:      string;
  internalPort: number;
  skipLaunch:   boolean;
};

function getFlyConfig(): FlyConfig | null {
  const token = process.env.FLY_API_TOKEN?.trim();
  const orgSlug = process.env.FLY_ORG_SLUG?.trim();

  if (!token || !orgSlug) {
    throw new Error("Failed");
  }

  // biome-ignore format: alinment
  return {
    token,
    orgSlug,
    hostname:     process.env.FLY_API_HOSTNAME?.trim()  || FLY_API_HOSTNAME_DEFAULT,
    image:        process.env.FLY_MACHINE_IMAGE?.trim() || "registry-1.docker.io/oven/bun:1",
    region:       process.env.FLY_REGION?.trim()        || "ord",
    internalPort: Number(process.env.FLY_INTERNAL_PORT?.trim() || 4000),
    skipLaunch:   process.env.FLY_SKIP_LAUNCH?.trim() === "true",
  };
}

export async function appCreate({
  appName,
}: {
  appName: string;
}): Promise<AppInstance> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const body = { org_slug: config.orgSlug, app_name: appName };

  const res = await flyFetch({
    config,
    path: "/v1/apps",
    options: { method: "POST", body: JSON.stringify(body) },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    created_at: number;
  };

  return { id: data.id, name: appName, status: "pending" };
}

export async function appRemove({
  appName,
}: {
  appName: string;
}): Promise<void> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}`,
    options: { method: "DELETE" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
}

export async function appRun({
  appName,
}: {
  appName: string;
}): Promise<{ previousState: string }[]> {
  const instances = await containerFindMany({ appName });

  const targets = instances.filter((i) => i.state !== "started");

  return Promise.all(
    targets.map((i) => containerRun({ appName, instanceId: i.id })),
  );
}

export async function appEnd({
  appName,
}: {
  appName: string;
}): Promise<{ previousState: string }[]> {
  const instances = await containerFindMany({ appName });

  const targets = instances.filter((i) => i.state === "started");

  return Promise.all(
    targets.map((i) => containerEnd({ appName, instanceId: i.id })),
  );
}

export async function containerFindMany({
  appName,
}: {
  appName: string;
}): Promise<ContainerInstance[]> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines`,
    options: { method: "GET" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as Array<{
    id: string;
    instance_id: string;
    state: string;
  }>;

  return data.map((m) => ({
    id: m.id,
    instanceId: m.instance_id,
    state: m.state,
  }));
}

export async function containerCreate({
  appName,
  files,
}: {
  appName: string;
  files: FlyFile[];
}): Promise<ContainerInstance> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const body = {
    region: config.region,
    config: {
      image: config.image,
      guest: { cpu_kind: "shared", cpus: 2, memory_mb: 2048 },
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: String(config.internalPort),
      },
      files,
      init: {
        cmd: INIT_CMD,
      },
      restart: {
        policy: "no",
      },
      services: [
        {
          protocol: "tcp",
          internal_port: config.internalPort,
          autostop: "stop",
          autostart: true,
          ports: [
            {
              port: 80,
              handlers: ["http"],
              force_https: true,
            },
            {
              port: 443,
              handlers: ["tls", "http"],
            },
          ],
        },
      ],
    },
    skip_launch: config.skipLaunch,
  };

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines`,
    options: { method: "POST", body: JSON.stringify(body) },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    instance_id: string;
    state: string;
  };

  return { id: data.id, instanceId: data.instance_id, state: data.state };
}

export async function containerUpdate({
  appName,
  machineId,
  files,
}: {
  appName: string;
  machineId: string;
  files: FlyFile[];
}): Promise<ContainerInstance> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const body = {
    config: {
      image: config.image,
      guest: { cpu_kind: "shared", cpus: 2, memory_mb: 2048 },
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: String(config.internalPort),
      },
      files,
      init: {
        cmd: INIT_CMD,
      },
      restart: {
        policy: "no",
      },
      services: [
        {
          protocol: "tcp",
          internal_port: config.internalPort,
          autostop: "stop",
          autostart: true,
          ports: [
            {
              port: 80,
              handlers: ["http"],
              force_https: true,
            },
            {
              port: 443,
              handlers: ["tls", "http"],
            },
          ],
        },
      ],
    },
    skip_launch: config.skipLaunch,
  };

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}`,
    options: { method: "POST", body: JSON.stringify(body) },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    instance_id: string;
    state: string;
  };

  return { id: data.id, instanceId: data.instance_id, state: data.state };
}

export async function containerRemove({
  appName,
  instanceId,
}: {
  appName: string;
  instanceId: string;
}): Promise<void> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(instanceId)}`,
    options: { method: "DELETE" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
}

export async function containerRun({
  appName,
  instanceId,
}: {
  appName: string;
  instanceId: string;
}): Promise<{ previousState: string }> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(instanceId)}/start`,
    options: { method: "POST" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { previous_state: string };

  return { previousState: data.previous_state };
}

export async function containerEnd({
  appName,
  instanceId,
}: {
  appName: string;
  instanceId: string;
}): Promise<{ previousState: string }> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(instanceId)}/stop`,
    options: { method: "POST" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { previous_state: string };

  return { previousState: data.previous_state };
}

export async function containerWaitForState({
  appName,
  machineId,
  instanceId,
  state,
  timeout = 30,
}: {
  appName: string;
  machineId: string;
  instanceId: string;
  state: string;
  timeout?: number;
}): Promise<void> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const res = await flyFetch({
    config,
    path: `/v1/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}/wait?instance_id=${encodeURIComponent(instanceId)}&state=${encodeURIComponent(state)}&timeout=${timeout}`,
    options: { method: "GET" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: ${res.status} ${text}`);
  }
}

export async function ipAllocate({
  appName,
}: {
  appName: string;
}): Promise<void> {
  const config = getFlyConfig();

  if (!config) throw new Error("Failed");

  const types = ["shared_v4", "v6"] as const;

  for (const type of types) {
    const body = { type };

    const res = await flyFetch({
      config,
      path: `/v1/apps/${encodeURIComponent(appName)}/ip_assignments`,
      options: { method: "POST", body: JSON.stringify(body) },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to allocate ${type}: ${res.status} ${text}`);
    }
  }
}

async function flyFetch({
  config,
  path,
  options,
}: {
  config: FlyConfig;
  path: string;
  options: RequestInit;
}): Promise<Response> {
  const url = path.startsWith("http") ? path : `${config.hostname}${path}`;

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
