class RoomType < ApplicationRecord
  belongs_to :hotel

  has_many :rooms, dependent: :destroy
  has_many :room_type_dates, dependent: :destroy
end
