#Come from the backend
data = ' '
marker_lat = 46.8862
marker_lon = -79.3832

lines = data.splitlines()
months = []
latitudes = []
longitudes = []
for line in lines[1:]:

  new = line.split('|')
  months.append(int(new[0][4:6]))
  latitudes.append(float(new[2]))
  longitudes.append(float(new[3]))

monthlist = ['02/24', '03/24', '04/24', '05/24', '06/24', '07/24', '08/24', '09/24', '10/24', '11/24', '12/24', '01/25']
incidents = [0,0,0,0,0,0,0,0,0,0,0,0]


from math import sin, cos, sqrt, atan2

for i in range(len(months)):

  dlon = longitudes[i] - marker_lon
  dlat = latitudes[i] - marker_lat
  angle = (sin(dlat/2))**2 + cos(marker_lat) * cos(latitudes[i]) * (sin(dlon/2))**2
  distance = 6373.0 * 2 * atan2(sqrt(angle), sqrt(1-angle))

  if distance < 900:
    if months[i] != 1:
      incidents[months[i] - 2] = incidents[months[i] - 2] + 1
    else:
      incidents[11] = incidents[11] + 1

import matplotlib.pyplot as plt

plt.figure(figsize=(10, 5))
plt.bar(monthlist, incidents)
plt.title('Related Incidents in the last Year')
plt.xlabel('Month')
plt.ylabel('Incidents')
plt.savefig('foo.png')