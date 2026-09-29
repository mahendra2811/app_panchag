"""Create the compact offline district location catalog from india-pincode-api.

Usage: python3 scripts/generate-postal-districts.py '/path/to/india-pincode-api'

The source is CC BY-NC 4.0. See src/data/cities/POSTAL_DATA_LICENSE.txt.
Coordinates are medians of post-office points, so they represent only an
approximate location within a postal district.
"""

import json
import statistics
import sys
from pathlib import Path


STATE_IDS = {
    'andaman-and-nicobar-islands': 'AN', 'andhra-pradesh': 'AP',
    'arunachal-pradesh': 'AR', 'assam': 'AS', 'bihar': 'BR',
    'chandigarh': 'CH', 'chhattisgarh': 'CG', 'delhi': 'DL', 'goa': 'GA',
    'gujarat': 'GJ', 'haryana': 'HR', 'himachal-pradesh': 'HP',
    'jammu-and-kashmir': 'JK', 'jharkhand': 'JH', 'karnataka': 'KA',
    'kerala': 'KL', 'ladakh': 'LA', 'lakshadweep': 'LD',
    'madhya-pradesh': 'MP', 'maharashtra': 'MH', 'manipur': 'MN',
    'meghalaya': 'ML', 'mizoram': 'MZ', 'nagaland': 'NL',
    'odisha': 'OD', 'puducherry': 'PY', 'punjab': 'PB',
    'rajasthan': 'RJ', 'sikkim': 'SK', 'tamil-nadu': 'TN',
    'telangana': 'TS', 'the-dadra-and-nagar-haveli-and-daman-and-diu': 'DH',
    'tripura': 'TR', 'uttar-pradesh': 'UP', 'uttarakhand': 'UK',
    'west-bengal': 'WB',
}


def main(source: Path) -> None:
    states = json.loads((source / 'states.json').read_text())
    rows: list[list[str | float]] = []
    for state in states:
        state_slug = state['slug']
        if state_slug == 'na':
            continue
        state_id = STATE_IDS[state_slug]
        detail = json.loads((source / 'states' / f'{state_slug}.json').read_text())
        if len(detail['districts']) != state['districtCount']:
            raise ValueError(f'District count mismatch: {state_slug}')
        for district in detail['districts']:
            source_file = source / 'districts' / state_slug / f"{district['slug']}.json"
            offices = json.loads(source_file.read_text())['offices']
            points = [(office['latitude'], office['longitude']) for office in offices
                      if isinstance(office.get('latitude'), (int, float))
                      and isinstance(office.get('longitude'), (int, float))
                      and 6 <= office['latitude'] <= 38
                      and 68 <= office['longitude'] <= 98]
            if not points:
                raise ValueError(f'No usable coordinates: {source_file}')
            latitude = round(statistics.median(point[0] for point in points), 5)
            longitude = round(statistics.median(point[1] for point in points), 5)
            name = district['name'].title().replace('S.A.S Nagar', 'S.A.S. Nagar')
            rows.append([f"{state_id.lower()}-{district['slug']}", name, state_id,
                         latitude, longitude])
    rows.sort(key=lambda row: (row[2], row[1]))
    # The upstream catalog also contains one synthetic "NA" record, which is excluded.
    if len(rows) != 754 or len({row[0] for row in rows}) != len(rows):
        raise ValueError(f'Unexpected district coverage: {len(rows)}')
    output = Path(__file__).resolve().parents[1] / 'src/data/cities/postal-districts.json'
    output.write_text(json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'Wrote {len(rows)} districts to {output}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Pass the india-pincode-api source directory')
    main(Path(sys.argv[1]))
