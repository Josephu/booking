class RoomTypeDate < ApplicationRecord
  belongs_to :room_type
  belongs_to :room

  validates :date, presence: true
  validates :rate, presence: true
end
