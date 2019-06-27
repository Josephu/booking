class Room < ApplicationRecord
  belongs_to :room_type
  has_many :room_type_dates
end
