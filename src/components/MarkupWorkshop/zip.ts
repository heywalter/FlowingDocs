// Small UTF-8 ZIP writer (stored entries), so the download contains the learner's edits.
export function zipFiles(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder()
  const locals: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0
  function header(size: number) {
    return new Uint8Array(size)
  }
  function crc(bytes: Uint8Array) {
    let value = 0xFFFFFFFF
    for (const byte of bytes) {
      value ^= byte
      for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xEDB88320 : 0)
    }
    return (value ^ 0xFFFFFFFF) >>> 0
  }
  for (const [name, text] of Object.entries(files)) {
    const filename = encoder.encode(name)
    const body = encoder.encode(text)
    const checksum = crc(body)
    const local = header(30 + filename.length + body.length)
    const a = new DataView(local.buffer)
    a.setUint32(0, 0x04034B50, true)
    a.setUint16(4, 20, true)
    a.setUint16(6, 0x0800, true)
    a.setUint16(12, 0x5C21, true)
    a.setUint32(14, checksum, true)
    a.setUint32(18, body.length, true)
    a.setUint32(22, body.length, true)
    a.setUint16(26, filename.length, true)
    local.set(filename, 30)
    local.set(body, 30 + filename.length)
    const entry = header(46 + filename.length)
    const b = new DataView(entry.buffer)
    b.setUint32(0, 0x02014B50, true)
    b.setUint16(4, 20, true)
    b.setUint16(6, 20, true)
    b.setUint16(8, 0x0800, true)
    b.setUint16(14, 0x5C21, true)
    b.setUint32(16, checksum, true)
    b.setUint32(20, body.length, true)
    b.setUint32(24, body.length, true)
    b.setUint16(28, filename.length, true)
    b.setUint32(42, offset, true)
    entry.set(filename, 46)
    locals.push(local)
    central.push(entry)
    offset += local.length
  }
  const directorySize = central.reduce((sum, item) => sum + item.length, 0)
  const end = header(22)
  const e = new DataView(end.buffer)
  e.setUint32(0, 0x06054B50, true)
  e.setUint16(8, central.length, true)
  e.setUint16(10, central.length, true)
  e.setUint32(12, directorySize, true)
  e.setUint32(16, offset, true)
  const output = new Uint8Array(offset + directorySize + end.length)
  let cursor = 0
  for (const part of [...locals, ...central, end]) {
    output.set(part, cursor)
    cursor += part.length
  }
  return output
}
