var cwise = require("../cwise.js")
var ndarray = require("ndarray")

var F0 = ndarray(new Float32Array(512*512), [512, 512]).transpose(1, 0)
var F1 = ndarray(new Float32Array(512*512), [512, 512]).transpose(1, 0)
var C0 = ndarray(new Float32Array(512*512), [512, 512])
var C1 = ndarray(new Float32Array(512*512), [512, 512])

var init_op = cwise({
  args: ["array"],
  body: function(a) {
    a = 0
  }
})

var test_op = cwise({
  args: ["array", "array"],
  body: function(a,b) {
    a += b * 0.5 + 1.0
  }
  , printCode: true
})

function bench(name, a, b) {
  init_op(a)
  init_op(b)
  var start = new Date()
  for(var i=0; i<1000; ++i) {
    test_op(a, b)
  }
  var end = new Date()
  console.log("Test:", name, "Time:", (end-start))
}

console.log("Warming up...")
test_op(F0, F1)
test_op(C0, C1)
test_op(C0, F1)
test_op(F0, C1)

console.log("Running tests...")
bench("C<-C", C0, C1)
bench("F<-F", F0, F1)
bench("C<-F", C0, F1)
bench("F<-C", F0, C1)
