import { readFile, writeFile } from 'node:fs/promises'

type MunicipalityType = 'city' | 'ward' | 'town' | 'village'

interface SourceMunicipality {
  city: string
  lgcode: string
  pref: string
}

interface Municipality {
  id: string
  name: string
  type: MunicipalityType
}

const sourceUrl = 'https://code4fukui.github.io/localgovjp/localgovjp.json'
const outputPath = new URL('../src/data/municipalities.json', import.meta.url)
const northernTerritoryVillages = [
  { id: '016951', name: '色丹村', type: 'village' },
  { id: '016969', name: '泊村', type: 'village' },
  { id: '016977', name: '留夜別村', type: 'village' },
  { id: '016985', name: '留別村', type: 'village' },
  { id: '016993', name: '紗那村', type: 'village' },
  { id: '017000', name: '蘂取村', type: 'village' },
] satisfies readonly Municipality[]

/** 自治体一覧をURLまたはローカルファイルから読み込む。 */
async function loadSource(sourcePath: string | undefined): Promise<SourceMunicipality[]> {
  if (sourcePath) {
    return JSON.parse(await readFile(sourcePath, 'utf8')) as SourceMunicipality[]
  }

  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error(`自治体データの取得に失敗しました: ${response.status}`)
  }

  return (await response.json()) as SourceMunicipality[]
}

/** 出題対象の自治体だけを残し、ゲーム用のデータ形式に変換する。 */
function createMunicipalities(source: readonly SourceMunicipality[]): Municipality[] {
  const municipalities = source.flatMap((record): Municipality[] => {
    const { city, lgcode, pref } = record
    const isTokyoSpecialWard = pref === '東京都' && /^.+区$/.test(city)

    if (!isTokyoSpecialWard && !/(?:市|町|村)$/.test(city)) {
      return []
    }

    const type: MunicipalityType = isTokyoSpecialWard
      ? 'ward'
      : city.endsWith('市')
        ? 'city'
        : city.endsWith('町')
          ? 'town'
          : 'village'

    return [{ id: lgcode, name: city, type }]
  })

  municipalities.push(...northernTerritoryVillages)

  const ids = new Set(municipalities.map(({ id }) => id))

  if (ids.size !== municipalities.length) {
    throw new Error('自治体コードが重複しています。')
  }

  const counts: Record<MunicipalityType, number> = {
    city: 0,
    ward: 0,
    town: 0,
    village: 0,
  }

  for (const { type } of municipalities) {
    counts[type] += 1
  }

  const expectedCounts: Record<MunicipalityType, number> = {
    city: 792,
    ward: 23,
    town: 743,
    village: 189,
  }

  const municipalityTypes = Object.keys(expectedCounts) as MunicipalityType[]
  const hasExpectedCounts = municipalityTypes.every((type) => counts[type] === expectedCounts[type])

  if (!hasExpectedCounts) {
    throw new Error(`自治体数が想定と異なります: ${JSON.stringify(counts)}`)
  }

  return municipalities.sort((left, right) => left.id.localeCompare(right.id))
}

/** 整形した自治体一覧をアプリが読み込むJSONファイルに保存する。 */
async function writeMunicipalities(municipalities: readonly Municipality[]): Promise<void> {
  await writeFile(outputPath, `${JSON.stringify(municipalities, null, 2)}\n`, 'utf8')
}

const sourcePath = process.argv[2]
const source = await loadSource(sourcePath)
const municipalities = createMunicipalities(source)
await writeMunicipalities(municipalities)
console.log(`${municipalities.length}件の自治体を出力しました。`)
