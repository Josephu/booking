class Api::V1::RoomTypesController < ApplicationController
  def show
    if (move_out_date < move_in_date)
      return render json: { message: 'move in date should be earlier than move out date'}, status: 400
    end
    @room_type = RoomType.where(params[:hotel_id])
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
