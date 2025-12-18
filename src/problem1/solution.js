
//Classic Loop pretty normal O(n)
var sum_to_n_a = function (n) {
  let result = 0;
  let i = 0
  while (i <= n){
    result += i++;
  }
  return result;
};
//Gauss formula, since its a mathemathic formula it is the fastest O(1)
var sum_to_n_b = function (n) {
  if(n <= 0) return 0
  return (n * (n + 1))/2
};
//Recursion, is pretty costly since ton of funtion call create a big call stack O(n) speed but O(n) space 
var sum_to_n_c = function (n) {
  if (n <= 0) return 0
  if (n === 1) return 1
  return n + sum_to_n_c(n-1);
};

//Change testNum here to test funtions
let testNum = 15

let [sumA, sumB, sumC] = [sum_to_n_a(testNum), sum_to_n_b(testNum), sum_to_n_c(testNum)];

console.log("result for sum_to_n: A, B, C respectively", sumA, sumB, sumC);