class Hotel < ApplicationRecord
  has_many :room_types, dependent: :destroy
end
