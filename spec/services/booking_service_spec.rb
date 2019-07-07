require 'rails_helper'

RSpec.describe BookingService do
  describe '#book' do
    before do
      Timecop.freeze(DateTime.new(2019,01,01))
    end
    
    after do
      Timecop.return
    end
    
    let!(:room_type) { create(:room_type) }
    let(:move_in_date) { Date.parse('2019-01-02') }
    let(:move_out_date) { Date.parse('2019-01-04') }
    
    before(:each) do
      room_type.room_type_dates.create(date: '2019-01-01', rate: 100, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-02', rate: 110, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-03', rate: 120, availability: 1)
      room_type.room_type_dates.create(date: '2019-01-04', rate: 130, availability: 0)      
    end

    it 'should reduce availability by one for booked dates' do
      service = BookingService.new(room_type.id, move_in_date, move_out_date)
      expect(service.book).to be_truthy

      room_type_dates = room_type.room_type_dates.order(date: :asc)
      expect(room_type_dates[0].availability).to eq(1)
      expect(room_type_dates[1].availability).to eq(0)
      expect(room_type_dates[2].availability).to eq(0)
      expect(room_type_dates[3].availability).to eq(0)
    end

    it 'should raise exception if missing dates or room type id' do
      expect { BookingService.new(nil, move_in_date, move_out_date) }.to raise_exception('missing room_type_id')
      expect { BookingService.new(room_type.id, nil, move_out_date) }.to raise_exception('move_in_date should be a Date')
      expect { BookingService.new(room_type.id, move_in_date, nil) }.to raise_exception('move_out_date should be a Date')
    end

    it 'should raise exception if move in date is yesterday' do
      expect {
        BookingService.new(room_type.id, Date.parse('2018-12-30'), Date.parse('2019-01-01'))
      }.to raise_exception('move_in_date should not be in the past')
    end

    it 'should raise exception if move in date is later than move out date' do
      expect {
        BookingService.new(room_type.id, Date.parse('2019-01-03'), Date.parse('2019-01-01'))
      }.to raise_exception('move in date should be earlier than move out date')
    end

    it 'should not book if availability is already 0 on one of the booked dates' do
      service = BookingService.new(room_type.id, Date.parse('2019-01-03'), Date.parse('2019-01-05'))
      expect {
        service.book
      }.to raise_exception('room not available')

      room_type_dates = room_type.room_type_dates.order(date: :asc)
      expect(room_type_dates[0].availability).to eq(1)
      expect(room_type_dates[1].availability).to eq(1)
      expect(room_type_dates[2].availability).to eq(1)
      expect(room_type_dates[3].availability).to eq(0)
    end

    it 'should not book if there is not enough data in the database' do
      service = BookingService.new(room_type.id, Date.parse('2019-01-05'), Date.parse('2019-01-06'))
      expect {
        service.book
      }.to raise_exception('room not available')

      room_type_dates = room_type.room_type_dates.order(date: :asc)
      expect(room_type_dates[0].availability).to eq(1)
      expect(room_type_dates[1].availability).to eq(1)
      expect(room_type_dates[2].availability).to eq(1)
      expect(room_type_dates[3].availability).to eq(0)
    end
  end
end
