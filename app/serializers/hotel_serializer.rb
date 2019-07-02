class HotelSerializer < ActiveModel::Serializer
  attributes :name, :cover_image, :id

  has_many :room_types
end