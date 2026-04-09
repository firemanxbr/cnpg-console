export interface K8sMeta {
  name: string;
  namespace: string;
  uid?: string;
  creationTimestamp?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface K8sListResponse<T> {
  apiVersion: string;
  kind: string;
  metadata: { continue?: string; resourceVersion?: string };
  items: T[];
}

export interface StorageConfiguration {
  size: string;
  storageClass?: string;
  resizeInUseVolumes?: boolean;
}

export interface CNPGCluster {
  apiVersion: string;
  kind: 'Cluster';
  metadata: K8sMeta;
  spec: {
    instances: number;
    imageName?: string;
    imageCatalogRef?: { apiGroup?: string; kind: string; name: string; major?: number };
    description?: string;
    storage: StorageConfiguration;
    walStorage?: StorageConfiguration;
    bootstrap?: {
      initdb?: { database?: string; owner?: string; dataChecksums?: boolean; encoding?: string; localeCollate?: string; localeCType?: string };
      recovery?: { source?: string; backup?: { name: string }; recoveryTarget?: { targetTime?: string; targetLSN?: string; targetName?: string; targetXID?: string; targetImmediate?: boolean; exclusive?: boolean } };
      pg_basebackup?: { source?: string; database?: string; owner?: string };
    };
    postgresql?: {
      parameters?: Record<string, string>;
      pg_hba?: string[];
      shared_preload_libraries?: string[];
      enableAlterSystem?: boolean;
    };
    replica?: { enabled?: boolean; source?: string; primary?: string };
    externalClusters?: { name: string; connectionParameters?: Record<string, string>; password?: { name: string; key: string } }[];
    backup?: {
      volumeSnapshot?: { className?: string };
      retentionPolicy?: string;
      target?: string;
    };
    managed?: {
      roles?: { name: string; ensure?: string; login?: boolean; superuser?: boolean; createdb?: boolean; createrole?: boolean; inherit?: boolean; replication?: boolean; connectionLimit?: number; passwordSecret?: { name: string } }[];
      services?: { additional?: { name: string; serviceType: string; selector?: Record<string, string> }[] };
    };
    monitoring?: { customQueriesConfigMap?: { name: string; key: string }[]; customQueriesSecret?: { name: string; key: string }[]; enablePodMonitor?: boolean; disableDefaultQueries?: boolean };
    enableSuperuserAccess?: boolean;
    superuserSecret?: { name: string };
    resources?: { limits?: { cpu?: string; memory?: string }; requests?: { cpu?: string; memory?: string } };
    affinity?: { nodeSelector?: Record<string, string>; tolerations?: { key: string; operator: string; value?: string; effect: string }[] };
    primaryUpdateStrategy?: 'unsupervised' | 'supervised';
    primaryUpdateMethod?: 'switchover' | 'restart';
    logLevel?: 'error' | 'warning' | 'info' | 'debug' | 'trace';
    startDelay?: number;
    stopDelay?: number;
    switchoverDelay?: number;
    failoverDelay?: number;
    enablePDB?: boolean;
    nodeMaintenanceWindow?: { inProgress?: boolean; reusePVC?: boolean };
    certificates?: { serverCASecret?: string; serverTLSSecret?: string; replicationTLSSecret?: string; clientCASecret?: string };
    replicationSlots?: { highAvailability?: { enabled?: boolean; slotPrefix?: string } };
    tablespaces?: { name: string; storage: StorageConfiguration }[];
  };
  status?: {
    instances?: number;
    readyInstances?: number;
    instancesStatus?: Record<string, string[]>;
    currentPrimary?: string;
    targetPrimary?: string;
    phase?: string;
    phaseReason?: string;
    conditions?: { type: string; status: string; lastTransitionTime?: string; reason?: string; message?: string }[];
    firstRecoverabilityPoint?: string;
    lastSuccessfulBackup?: string;
    certificates?: { expirations?: Record<string, string> };
    managedRolesStatus?: { byStatus?: Record<string, string[]> };
    poolerIntegrations?: { pgBouncerIntegration?: { secrets: string[] } };
    availableArchitectures?: { goArch: string; hash: string }[];
  };
}

export interface CNPGBackup {
  apiVersion: string;
  kind: 'Backup';
  metadata: K8sMeta;
  spec: {
    cluster: { name: string };
    method?: 'barmanObjectStore' | 'volumeSnapshot' | 'plugin';
    target?: 'primary' | 'prefer-standby';
    online?: boolean;
  };
  status?: {
    phase?: string;
    backupId?: string;
    backupName?: string;
    startedAt?: string;
    stoppedAt?: string;
    beginWal?: string;
    endWal?: string;
    beginLSN?: string;
    endLSN?: string;
    error?: string;
    method?: string;
    instanceID?: { podName?: string; containerID?: string };
  };
}

export interface CNPGScheduledBackup {
  apiVersion: string;
  kind: 'ScheduledBackup';
  metadata: K8sMeta;
  spec: {
    schedule: string;
    cluster: { name: string };
    method?: 'barmanObjectStore' | 'volumeSnapshot' | 'plugin';
    suspend?: boolean;
    immediate?: boolean;
    backupOwnerReference?: 'none' | 'self' | 'cluster';
  };
  status?: {
    lastCheckTime?: string;
    lastScheduleTime?: string;
    nextScheduleTime?: string;
  };
}

export interface CNPGPooler {
  apiVersion: string;
  kind: 'Pooler';
  metadata: K8sMeta;
  spec: {
    cluster: { name: string };
    instances: number;
    type?: 'rw' | 'ro';
    pgbouncer: {
      poolMode: 'session' | 'transaction' | 'statement';
      parameters?: Record<string, string>;
      authQuerySecret?: { name: string };
      authQuery?: string;
    };
    paused?: boolean;
    monitoring?: { enablePodMonitor?: boolean };
  };
  status?: {
    instances?: number;
    secrets?: { pgBouncerSecrets?: { authQuery?: { name: string } } };
  };
}

export interface CNPGDatabase {
  apiVersion: string;
  kind: 'Database';
  metadata: K8sMeta;
  spec: {
    cluster: { name: string };
    name: string;
    owner: string;
    ensure?: 'present' | 'absent';
    template?: string;
    encoding?: string;
    locale?: string;
    localeCollate?: string;
    localeCType?: string;
    isTemplate?: boolean;
    allowConnections?: boolean;
    connectionLimit?: number;
    tablespace?: string;
    databaseReclaimPolicy?: 'delete' | 'retain';
  };
  status?: {
    applied?: boolean;
    observedGeneration?: number;
    message?: string;
  };
}

export interface CNPGPublication {
  apiVersion: string;
  kind: 'Publication';
  metadata: K8sMeta;
  spec: {
    cluster: { name: string };
    dbname: string;
    name: string;
    target?: {
      allTables?: boolean;
      objects?: { tablesInSchema?: string; table?: { name: string; schema?: string } }[];
    };
    publicationReclaimPolicy?: 'retain' | 'delete';
  };
  status?: {
    applied?: boolean;
    observedGeneration?: number;
    message?: string;
  };
}

export interface CNPGSubscription {
  apiVersion: string;
  kind: 'Subscription';
  metadata: K8sMeta;
  spec: {
    cluster: { name: string };
    dbname: string;
    name: string;
    externalClusterName: string;
    publicationName: string;
    subscriptionReclaimPolicy?: 'retain' | 'delete';
  };
  status?: {
    applied?: boolean;
    observedGeneration?: number;
    message?: string;
  };
}

export interface CNPGImageCatalog {
  apiVersion: string;
  kind: 'ImageCatalog';
  metadata: K8sMeta;
  spec: {
    images: { major: number; image: string }[];
  };
}

export interface CNPGClusterImageCatalog {
  apiVersion: string;
  kind: 'ClusterImageCatalog';
  metadata: K8sMeta;
  spec: {
    images: { major: number; image: string }[];
  };
}
