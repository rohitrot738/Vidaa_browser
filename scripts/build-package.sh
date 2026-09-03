#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="${1:-${project_dir}/dist}"
version="$(node -e "const m=require('${project_dir}/manifest.template.json'); process.stdout.write(m.version)")"
package_name="vidaa-browser-devkit-v${version}"
zip_path="${output_dir}/${package_name}.zip"
checksum_path="${zip_path}.sha256"
stage_root="$(mktemp -d)"
stage_dir="${stage_root}/${package_name}"

cleanup() {
  rm -rf "${stage_root}"
}
trap cleanup EXIT

runtime_files=(
  "index.html"
  "style.css"
  "vidaa-adapter.js"
  "browser-core.js"
  "remote.js"
  "script.js"
  "manifest.template.json"
  "README.md"
  "VIDAA_INSTALL_HINDI.md"
)

mkdir -p "${output_dir}" "${stage_dir}"

for relative_path in "${runtime_files[@]}"; do
  source_path="${project_dir}/${relative_path}"
  if [[ ! -f "${source_path}" ]]; then
    echo "Missing package file: ${relative_path}" >&2
    exit 1
  fi
  cp "${source_path}" "${stage_dir}/${relative_path}"
done

printf '%s\n' "${version}" > "${stage_dir}/VERSION"
rm -f "${zip_path}" "${checksum_path}"
(
  cd "${stage_root}"
  zip -q -r "${zip_path}" "${package_name}"
)
(
  cd "${output_dir}"
  sha256sum "$(basename "${zip_path}")" > "$(basename "${checksum_path}")"
)

echo "Created ${zip_path}"
echo "Created ${checksum_path}"
