{{- define "cnpg-console.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- define "cnpg-console.fullname" -}}
{{- if .Values.fullnameOverride }}{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}{{- end }}{{- end }}
{{- end }}
{{- define "cnpg-console.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{ include "cnpg-console.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{- define "cnpg-console.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cnpg-console.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{- define "cnpg-console.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}{{- default (include "cnpg-console.fullname" .) .Values.serviceAccount.name }}
{{- else }}{{- default "default" .Values.serviceAccount.name }}{{- end }}
{{- end }}
