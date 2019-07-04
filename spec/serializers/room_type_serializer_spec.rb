require 'rails_helper'

RSpec.describe RoomTypeSerializer do
  describe '#average_monthly_rate' do
    let!(:room_type) { create(:room_type) }
    let(:move_in_date) { Date.parse('2019-01-02') }
    let(:move_out_date) { Date.parse('2019-01-04') }
    
    before(:each) do
      room_type.room_type_dates.create(date: '2019-01-01', rate: 100, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-02', rate: 110, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-03', rate: 120, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-04', rate: 130, availability: 0)      
    end

    it 'should provide average rate across the dates multiply by 30' do
      serializer = RoomTypeSerializer.new(
        room_type,
        move_in_date: move_in_date,
        move_out_date: move_out_date
      )
      
      expect(serializer.attributes[:average_monthly_rate]).to eq(3450)
      expect(serializer.attributes[:available]).to eq(true)
    end

    it 'should not provide rate if no move in date' do
      serializer = RoomTypeSerializer.new(
        room_type,
        move_out_date: move_out_date
      )
      
      expect(serializer.attributes[:average_monthly_rate]).to be_nil
      expect(serializer.attributes[:available]).to be_nil
    end

    it 'should not provide rate if no move out date' do
      serializer = RoomTypeSerializer.new(
        room_type,
        move_in_date: move_in_date
      )
      
      expect(serializer.attributes[:average_monthly_rate]).to be_nil
      expect(serializer.attributes[:available]).to be_nil
    end

    it 'should have nil rate and show unavailable if no data in these dates' do
      serializer = RoomTypeSerializer.new(
        room_type,
        move_in_date: Date.parse('2018-01-01'),
        move_out_date: Date.parse('2018-01-02')
      )
      
      expect(serializer.attributes[:average_monthly_rate]).to be_nil
      expect(serializer.attributes[:available]).to be false
    end
  end
end
