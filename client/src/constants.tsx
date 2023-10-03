
export const numResultsOptions = Array.from({ length: 10 }, (_, i) => i + 1)

export const regionOptions = [
  'north_east',
  'north_west',
  'east_midlands',
  'west_midlands',
  'east_of_england',
  'greater_london',
  'south_east',
  'south_west',
  'wales',
  'scotland',
  'northern_ireland',
]

export const regionOptionLabels: { [key: string]: string } = {
  north_east: 'North East',
  north_west: 'North West',
  east_midlands: 'East Midlands',
  west_midlands: 'West Midlands',
  east_of_england: 'East of England',
  greater_london: 'Greater London',
  south_east: 'South East',
  south_west: 'South West',
  wales: 'Wales',
  scotland: 'Scotland',
  northern_ireland: 'Northern Ireland',
}

export const orderByOptionLabels: { [key: string]: string} = {
  asc: 'Ascending',
  desc: 'Descending',
}