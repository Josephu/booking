class HotelSerializer < ActiveModel::Serializer
  attributes :name, :cover_image, :uuid

  has_many :room_types
end