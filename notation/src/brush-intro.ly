\version "2.24.3"

\header {
  title = "Brush Intro (4 bars)"
  subtitle = "Light sweep feel"
  tagline = ""
}

global = {
  \time 4/4
  \tempo 4 = 112
}

hiHat = \drummode {
  hh8 hh hh hh hh hh hh hh
}

snare = \drummode {
  s8 s sn s s s sn s
}

bass = \drummode {
  bd4 bd bd bd
}

\score {
  \new DrumStaff <<
    \new DrumVoice { \voiceOne \repeat unfold 4 { \global \hiHat } }
    \new DrumVoice { \voiceTwo \repeat unfold 4 { \global \snare } }
    \new DrumVoice { \voiceThree \repeat unfold 4 { \global \bass } }
  >>
  \layout { }
}
