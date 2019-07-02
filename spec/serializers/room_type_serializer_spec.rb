require 'rails_helper'

RSpec.describe RoomTypeSerializer do
  describe '#average_monthly_rate' do
    let!(:room_type) { create(:room_type) }
    let!(:room) { create(:room, room_type_id: room_type.id) }

    it 'should provide average rate across the dates multiply by 30' do
      # Setup room type dates
      room_type.room_type_dates.create(date: '2019-01-01', rate: 100, room: room)
      room_type.room_type_dates.create(date: '2019-01-02', rate: 110, room: room)
      room_type.room_type_dates.create(date: '2019-01-03', rate: 120, room: room)
      room_type.room_type_dates.create(date: '2019-01-04', rate: 130, room: room)

      # Setup move in and move out date
      move_in_date = Date.parse('2019-01-02')
      move_out_date = Date.parse('2019-01-04')

      # Setup serializer
      serializer = RoomTypeSerializer.new(
        room_type,
        move_in_date: move_in_date,
        move_out_date: move_out_date
      )
      
      expect(serializer.attributes[:average_monthly_rate]).to eq(3450)
      expect(serializer.attributes[:available]).to eq(true)
    end
  end
end
