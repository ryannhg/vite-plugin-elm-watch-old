module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Events
import Math


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , update = update
        , view = view
        }



-- INIT


type alias Model =
    { counter : Int
    }


init : Model
init =
    { counter = 0
    }



-- UPDATE


type Msg
    = Increment
    | Decrement


update : Msg -> Model -> Model
update msg model =
    case msg of
        Increment ->
            { model | counter = Math.add model.counter 1 }

        Decrement ->
            { model | counter = model.counter - 1 }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ button [ Html.Events.onClick Increment ] [ text "Increment" ]
        , h1 [] [ text (String.fromInt model.counter) ]
        , button [ Html.Events.onClick Decrement ] [ text "Decrement" ]
        ]
