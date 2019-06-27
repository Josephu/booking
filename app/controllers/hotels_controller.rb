class HotelsController < ApplicationController
  def index
    @hotels = Hotel.all
    render json: @hotels
  end
end