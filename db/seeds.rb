# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

hotel = Hotel.create(name: 'test hotel', cover_image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Koala_climbing_tree.jpg')
hotel2 = Hotel.create(name: 'test hotel2', cover_image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Koala_climbing_tree.jpg')

room_type_1 = hotel.room_types.create(name: 'test room type 1')
room_type_2 = hotel.room_types.create(name: 'test room type 2')

start_date = Date.today - 1.day
# This is not optimized for speed just a dirty quick seed step
(0..365).each do |day|
  date = start_date + day.day
  room_type_1.room_type_dates.create(date: date, rate: 100, availability: 2)
  room_type_2.room_type_dates.create(date: date, rate: 200, availability: 4)
end
