class Hotel < ApplicationRecord
  has_many :room_types, dependent: :destroy
  before_create :generate_uuid

  private
    def generate_uuid
      self.uuid = SecureRandom.uuid
    end
end
