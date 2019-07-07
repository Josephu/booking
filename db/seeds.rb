# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

hotel = Hotel.create(name: 'Quest Ryde', cover_image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Koala_climbing_tree.jpg')
hotel2 = Hotel.create(name: 'Hilton Sydney', cover_image: 'https://pix6.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?s=1024x768')

room_type_1 = hotel.room_types.create(name: 'Quest queen room')
room_type_2 = hotel.room_types.create(name: 'Quest king room')

room_type_3 = hotel2.room_types.create(name: 'Hilton queen room')
room_type_4 = hotel2.room_types.create(name: 'Hilton king room')


start_date = Date.today - 1.day
# This is not optimized for speed just a dirty quick seed step
(0..365).each do |day|
  date = start_date + day.day
  room_type_1.room_type_dates.create(date: date, rate: 100, availability: 2)
  room_type_2.room_type_dates.create(date: date, rate: 200, availability: 4)
  room_type_3.room_type_dates.create(date: date, rate: 150, availability: 3)
  room_type_4.room_type_dates.create(date: date, rate: 250, availability: 4)
end
