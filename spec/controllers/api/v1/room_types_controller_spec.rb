require 'rails_helper'

describe Api::V1::RoomTypesController, :type => :controller do
  let!(:room_type) { create(:room_type, name: 'room1') }
  let!(:another_room_type) { create(:room_type, name: 'room2', hotel: room_type.hotel) }
  let(:move_in_date) { Date.parse('2019-01-02') }
  let(:move_out_date) { Date.parse('2019-01-04') }

  before(:each) do
    room_type.room_type_dates.create(date: '2019-01-01', rate: 100, availability: 1)
    room_type.room_type_dates.create(date: '2019-01-02', rate: 110, availability: 1)
    room_type.room_type_dates.create(date: '2019-01-03', rate: 120, availability: 1)
    room_type.room_type_dates.create(date: '2019-01-04', rate: 130, availability: 0)
    another_room_type.room_type_dates.create(date: '2019-01-01', rate: 100, availability: 1)
  end
  before do
    Timecop.freeze(DateTime.new(2019,01,01))
  end

  after do
    Timecop.return
  end

  describe 'GET #index' do
    before(:each) do
      get :index, params: { hotel_id: room_type.hotel_id }
    end
    it 'should return success and have all rooms' do
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response[0]['name']).to eq('room1')
      expect(json_response[1]['name']).to eq('room2')
    end
  end
  describe 'GET #show' do
    it 'should return success and have details for this room' do
      get :show, params: {
        hotel_id: room_type.hotel_id,
        id: room_type.id,
        move_in_date: '2019-01-01',
        move_out_date: '2019-01-02'
      }
      expect(response.status).to eq(200)
      json_response = JSON.parse(response.body)
      expect(json_response['name']).to eq('room1')
      expect(json_response['available']).to eq(true)
      expect(json_response['average_monthly_rate'].to_i).to eq(3000)
      expect(json_response['move_in_date']).to eq('2019-01-01')
      expect(json_response['move_out_date']).to eq('2019-01-02')
    end
    it 'should return error and have details for this room' do
      get :show, params: {
        hotel_id: room_type.hotel_id,
        id: room_type.id,
        move_in_date: '2019-01-02',
        move_out_date: '2019-01-01'
      }
      expect(response.status).to eq(400)
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('move in date should be earlier than move out date')
    end
  end
  describe 'POST #book' do
    it 'should be successful if room available' do
      post :book, params: {
        hotel_id: room_type.hotel_id,
        room_type_id: room_type.id,
        move_in_date: '2019-01-01',
        move_out_date: '2019-01-02'
      }
      expect(response.status).to eq(200)
      json_response = JSON.parse(response.body)
      expect(json_response['name']).to eq('room1')
      expect(json_response['available']).to eq(false)
      expect(json_response['average_monthly_rate'].to_i).to eq(3000)
      expect(json_response['move_in_date']).to eq('2019-01-01')
      expect(json_response['move_out_date']).to eq('2019-01-02')
    end
    it 'should fail if room not available' do
      post :book, params: {
        hotel_id: room_type.hotel_id,
        room_type_id: room_type.id,
        move_in_date: '2019-01-04',
        move_out_date: '2019-01-05'
      }
      expect(response.status).to eq(400)
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq('room not available')
    end
  end
end
