# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

hotel = Hotel.create(name: 'test hotel')

room_type_1 = hotel.room_types.create(name: 'test room type 1')
room_type_2 = hotel.room_types.create(name: 'test room type 2')

room_1_1 = room_type_1.rooms.create(name: 'room 1 for room type 1')
room_1_2 = room_type_1.rooms.create(name: 'room 2 for room type 1')
room_2_1 = room_type_2.rooms.create(name: 'room 1 for room type 2')
room_2_2 = room_type_2.rooms.create(name: 'room 2 for room type 2')

start_date = Date.today - 1.day
# This is not optimized for speed just a dirty quick seed step
(0..365).each do |day|
  date = start_date + day.day
  room_1_1.room_type_dates.create(date: date, rate: 100, room_type_id: room_type_1.id)
  room_1_2.room_type_dates.create(date: date, rate: 200, room_type_id: room_type_1.id)
  room_2_1.room_type_dates.create(date: date, rate: 10.5, room_type_id: room_type_2.id)
  room_2_2.room_type_dates.create(date: date, rate: 1.5, room_type_id: room_type_2.id)
end
