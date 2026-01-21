\version "2.24.3"

\header {
  title = "Oom-Chunk Guitar (4 bars)"
  subtitle = "Swing comp with off-beat chops"
  tagline = ""
}

global = {
  \time 4/4
  \tempo 4 = 180
}

chords = \chordmode {
  c1:m7 | f1:7 | c1:m7 | g1:7
}

gtrPattern = {
  \global
  \repeat unfold 4 {
    c'8 r8 <c' e' g'>8 r8
    c'8 r8 <c' e' g'>8 r8
  }
}

\score {
  <<
    \new ChordNames { \chords }
    \new Staff \with { instrumentName = "Gtr." } {
      \clef "treble_8"
      \gtrPattern
    }
  >>
  \layout { }
}
