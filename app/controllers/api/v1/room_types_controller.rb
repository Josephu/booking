class Api::V1::RoomTypesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @room_types = RoomType.where(params[:hotel_id])
    render json: @room_types
  end

  def show
    if (move_out_date < move_in_date)
      return render json: { message: 'move in date should be earlier than move out date' }, status: 400
    end
    @room_type = RoomType.find(params[:id])
    render json: @room_type, move_in_date: move_in_date, move_out_date: move_out_date
  end

  def book
    begin
      result = BookingService.new(params[:room_type_id], move_in_date, move_out_date).book
    rescue => e
      return render json: { message: e.message }, status: 400
    end
    @room_type = RoomType.find(params[:room_type_id])
    render json: @room_type, move_in_date: move_in_date, move_out_date: move_out_date
  end

  def room_type_params
    params.require(:move_in_date)
    params.require(:move_out_date)
    params
  end

  private
    def move_in_date
      Date.parse(room_type_params[:move_in_date])
    end

    def move_out_date
      Date.parse(room_type_params[:move_out_date])
    end
end
