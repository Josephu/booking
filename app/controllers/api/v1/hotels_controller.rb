class Api::V1::HotelsController < ApplicationController
  def index
    @hotels = Hotel.all
    render json: @hotels
  end

  def show
    @hotel = Hotel.find(params[:id])
    render json: @hotel
  end
end
