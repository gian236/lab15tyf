# Lab 15 — IPFS + Pinata: CID + pin + resolve
*Venture: PactTrail | Sesión 18 | Fecha: 2026-10-13*

Cierra el ciclo *content-addressed* completo: producir un CID, pinnearlo en Pinata, resolverlo por gateway HTTP y documentar la política de datos del venture.

---

## Archivos

| Archivo | Descripción |
|---|---|
| [`venture-hello.json`](./venture-hello.json) | Artefacto de prueba sin PII subido a IPFS |
| [`upload-to-pinata.js`](./upload-to-pinata.js) | Script Node.js para subir a Pinata |
| [`STORAGE.md`](./STORAGE.md) | Política de datos del venture |
| [`lab15-log.md`](./lab15-log.md) | Log de upload, CID, gateway y evidencia |
| [`.env.example`](./.env.example) | Template de credenciales (`.env` en `.gitignore`) |

---

## Uso rápido

```bash
# 1. Configura credenciales (NUNCA commitear .env)
cp .env.example .env
# Edita .env: PINATA_JWT=<tu_jwt>  PINATA_GATEWAY=<tu_gateway>

# 2. Sube el archivo
node upload-to-pinata.js

# 3. Verifica el CID
curl -s https://<GATEWAY>/ipfs/<CID>
```

---

## LAB # 15

- **STORAGE.md:** [`STORAGE.md`](./STORAGE.md)
- **CID del artefacto:** `bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq`
- **URL del gateway:** https://gateway.pinata.cloud/ipfs/bafkreiggwzqcnu2ovnboop6zdv7ctimj2p2gvr3kjzxfp7k65ztllknhyq
- **Resolve:** ✅ HTTP 200 OK confirmado
- **Pin activo:** ✅ Pinata — 2026-10-13T06:39:17.940Z

> ⚠️ El JWT de Pinata no aparece en ningún archivo de este repositorio.
> Almacénalo únicamente en tu `.env` local.
