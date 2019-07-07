class RoomTypeDate < ApplicationRecord
  belongs_to :room_type

  validates :date, presence: true
  validates :rate, presence: true
end
