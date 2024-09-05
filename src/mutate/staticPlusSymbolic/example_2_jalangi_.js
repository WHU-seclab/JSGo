J$.iids = {"8":[11,9,11,17],"9":[1,14,1,21],"10":[6,7,6,12],"16":[6,7,6,12],"17":[1,22,1,30],"18":[7,10,7,11],"24":[28,7,28,16],"25":[1,14,1,31],"26":[8,9,8,14],"32":[32,7,32,83],"33":[1,14,1,31],"34":[11,9,11,17],"41":[1,14,1,31],"42":[12,11,12,16],"49":[2,10,2,17],"50":[15,11,15,17],"57":[2,18,2,22],"58":[18,11,18,16],"65":[2,10,2,23],"66":[18,7,18,16],"73":[2,10,2,23],"74":[18,7,18,20],"81":[2,10,2,23],"82":[28,7,28,16],"89":[5,11,5,12],"90":[32,7,32,83],"97":[5,11,5,12],"105":[5,11,5,12],"113":[6,7,6,8],"121":[6,11,6,12],"129":[7,10,7,11],"137":[7,5,7,6],"145":[7,5,7,11],"153":[7,5,7,12],"161":[8,9,8,10],"169":[8,13,8,14],"177":[8,9,8,14],"185":[8,5,8,15],"193":[11,9,11,10],"201":[11,14,11,17],"209":[12,11,12,12],"217":[12,15,12,16],"225":[12,11,12,16],"233":[12,7,12,17],"241":[15,11,15,12],"249":[15,15,15,17],"257":[15,11,15,17],"265":[15,7,15,18],"273":[18,7,18,8],"281":[18,11,18,12],"289":[18,15,18,16],"297":[18,19,18,20],"305":[18,7,18,20],"313":[18,3,18,21],"321":[19,10,19,11],"329":[19,10,19,11],"337":[19,3,19,12],"345":[4,1,20,2],"353":[4,1,20,2],"361":[4,1,20,2],"369":[4,1,20,2],"377":[4,1,20,2],"385":[23,14,23,16],"393":[23,24,23,27],"401":[23,29,23,30],"409":[23,14,23,31],"411":[23,14,23,23],"417":[23,14,23,31],"425":[23,14,23,31],"433":[24,14,24,16],"441":[24,24,24,27],"449":[24,29,24,30],"457":[24,14,24,31],"459":[24,14,24,23],"465":[24,14,24,31],"473":[24,14,24,31],"481":[25,11,25,18],"489":[25,19,25,23],"497":[25,25,25,29],"505":[25,11,25,30],"513":[25,11,25,30],"521":[25,11,25,30],"529":[26,22,26,88],"537":[26,22,26,88],"545":[26,22,26,88],"553":[28,7,28,8],"561":[28,13,28,16],"569":[30,4,30,11],"577":[30,17,30,18],"585":[30,4,30,19],"587":[30,4,30,16],"593":[30,4,30,20],"601":[32,7,32,13],"609":[32,25,32,33],"617":[32,7,32,34],"619":[32,7,32,24],"625":[32,42,32,48],"633":[32,49,32,50],"641":[32,42,32,51],"649":[32,7,32,52],"651":[32,7,32,41],"657":[32,60,32,65],"665":[32,7,32,66],"667":[32,7,32,59],"673":[32,71,32,83],"681":[33,12,33,16],"689":[33,12,33,16],"697":[33,5,33,17],"705":[35,12,35,17],"713":[35,12,35,17],"721":[35,5,35,18],"729":[22,1,37,2],"737":[22,1,37,2],"745":[22,1,37,2],"753":[22,1,37,2],"761":[22,1,37,2],"769":[22,1,37,2],"777":[22,1,37,2],"785":[22,1,37,2],"793":[39,1,39,7],"801":[39,18,39,43],"809":[39,1,39,43],"817":[39,1,39,44],"825":[40,1,40,26],"833":[40,27,40,28],"841":[40,30,40,31],"849":[40,1,40,32],"857":[40,1,40,33],"865":[1,1,40,33],"873":[1,1,40,33],"881":[1,1,40,33],"889":[4,1,20,2],"897":[1,1,40,33],"905":[22,1,37,2],"913":[1,1,40,33],"921":[11,5,16,6],"929":[6,3,17,4],"937":[4,1,20,2],"945":[4,1,20,2],"953":[28,3,30,4],"961":[32,3,36,4],"969":[22,1,37,2],"977":[22,1,37,2],"985":[1,1,40,33],"993":[1,1,40,33],"nBranches":8,"originalCodeFileName":"/pppj/src/mutate/staticPlusSymbolic/example_2.js","instrumentedCodeFileName":"/pppj/src/mutate/staticPlusSymbolic/example_2_jalangi_.js","code":"const crypto = require('crypto');\nvar S$ = require('S$');\n\nfunction compute(A, B) {\n    var C = 0;\n    if (A > 3) {\n        B -= 2;\n        A = A + B;\n    }\n    else {\n        if (A == 126) {\n            B = B * 2;\n        }\n        else {\n            B = B + 10;\n        }\n    }\n    C = C + 2*A + B;\n    return C;\n}\n\nfunction processInputsAndCheckHash(A, B) {\n    var symA = S$.symbol('A', 0);\n    var symB = S$.symbol('B', 0);\n    let C = compute(symA, symB);\n    let expectedHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';\n    //instrumentation\n    if (C===123) { //runtime value of C observed when executing test suites\n    }\n    process.exit(1);\n    //instrumentation\n    if (crypto.createHash('sha256').update(String(C)).digest('hex') === expectedHash) {\n        return true;\n    } else {\n        return false;\n    }\n}\n\nmodule.exports = processInputsAndCheckHash;\nprocessInputsAndCheckHash(1, 2)\n"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(865, '/pppj/src/mutate/staticPlusSymbolic/example_2_jalangi_.js', '/pppj/src/mutate/staticPlusSymbolic/example_2.js');
            function compute(A, B) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(345, arguments.callee, this, arguments);
                            arguments = J$.N(353, 'arguments', arguments, 4);
                            A = J$.N(361, 'A', A, 4);
                            B = J$.N(369, 'B', B, 4);
                            J$.N(377, 'C', C, 0);
                            var C = J$.X1(105, J$.W(97, 'C', J$.T(89, 0, 22, false), C, 1));
                            if (J$.X1(929, J$.C(16, J$.B(10, '>', J$.R(113, 'A', A, 0), J$.T(121, 3, 22, false), 0)))) {
                                J$.X1(153, B = J$.W(145, 'B', J$.B(18, '-', J$.R(137, 'B', B, 0), J$.T(129, 2, 22, false), 0), B, 0));
                                J$.X1(185, A = J$.W(177, 'A', J$.B(26, '+', J$.R(161, 'A', A, 0), J$.R(169, 'B', B, 0), 0), A, 0));
                            } else {
                                if (J$.X1(921, J$.C(8, J$.B(34, '==', J$.R(193, 'A', A, 0), J$.T(201, 126, 22, false), 0)))) {
                                    J$.X1(233, B = J$.W(225, 'B', J$.B(42, '*', J$.R(209, 'B', B, 0), J$.T(217, 2, 22, false), 0), B, 0));
                                } else {
                                    J$.X1(265, B = J$.W(257, 'B', J$.B(50, '+', J$.R(241, 'B', B, 0), J$.T(249, 10, 22, false), 0), B, 0));
                                }
                            }
                            J$.X1(313, C = J$.W(305, 'C', J$.B(74, '+', J$.B(66, '+', J$.R(273, 'C', C, 0), J$.B(58, '*', J$.T(281, 2, 22, false), J$.R(289, 'A', A, 0), 0), 0), J$.R(297, 'B', B, 0), 0), C, 0));
                            return J$.X1(337, J$.Rt(329, J$.R(321, 'C', C, 0)));
                        } catch (J$e) {
                            J$.Ex(937, J$e);
                        } finally {
                            if (J$.Fr(945))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function processInputsAndCheckHash(A, B) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(729, arguments.callee, this, arguments);
                            arguments = J$.N(737, 'arguments', arguments, 4);
                            A = J$.N(745, 'A', A, 4);
                            B = J$.N(753, 'B', B, 4);
                            J$.N(761, 'symA', symA, 0);
                            J$.N(769, 'symB', symB, 0);
                            J$.N(777, 'C', C, 0);
                            J$.N(785, 'expectedHash', expectedHash, 0);
                            var symA = J$.X1(425, J$.W(417, 'symA', J$.M(409, J$.R(385, 'S$', S$, 1), 'symbol', 0)(J$.T(393, 'A', 21, false), J$.T(401, 0, 22, false)), symA, 1));
                            var symB = J$.X1(473, J$.W(465, 'symB', J$.M(457, J$.R(433, 'S$', S$, 1), 'symbol', 0)(J$.T(441, 'B', 21, false), J$.T(449, 0, 22, false)), symB, 1));
                            var C = J$.X1(521, J$.W(513, 'C', J$.F(505, J$.R(481, 'compute', compute, 1), 0)(J$.R(489, 'symA', symA, 0), J$.R(497, 'symB', symB, 0)), C, 1));
                            var expectedHash = J$.X1(545, J$.W(537, 'expectedHash', J$.T(529, 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 21, false), expectedHash, 1));
                            if (J$.X1(953, J$.C(24, J$.B(82, '===', J$.R(553, 'C', C, 0), J$.T(561, 123, 22, false), 0)))) {
                            }
                            J$.X1(593, J$.M(585, J$.R(569, 'process', process, 2), 'exit', 0)(J$.T(577, 1, 22, false)));
                            if (J$.X1(961, J$.C(32, J$.B(90, '===', J$.M(665, J$.M(649, J$.M(617, J$.R(601, 'crypto', crypto, 1), 'createHash', 0)(J$.T(609, 'sha256', 21, false)), 'update', 0)(J$.F(641, J$.R(625, 'String', String, 2), 0)(J$.R(633, 'C', C, 0))), 'digest', 0)(J$.T(657, 'hex', 21, false)), J$.R(673, 'expectedHash', expectedHash, 0), 0)))) {
                                return J$.X1(697, J$.Rt(689, J$.T(681, true, 23, false)));
                            } else {
                                return J$.X1(721, J$.Rt(713, J$.T(705, false, 23, false)));
                            }
                        } catch (J$e) {
                            J$.Ex(969, J$e);
                        } finally {
                            if (J$.Fr(977))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(873, 'crypto', crypto, 0);
            J$.N(881, 'S$', S$, 0);
            compute = J$.N(897, 'compute', J$.T(889, compute, 12, false, 345), 0);
            processInputsAndCheckHash = J$.N(913, 'processInputsAndCheckHash', J$.T(905, processInputsAndCheckHash, 12, false, 729), 0);
            var crypto = J$.X1(41, J$.W(33, 'crypto', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, 'crypto', 21, false)), crypto, 3));
            var S$ = J$.X1(81, J$.W(73, 'S$', J$.F(65, J$.R(49, 'require', require, 2), 0)(J$.T(57, 'S$', 21, false)), S$, 3));
            J$.X1(817, J$.P(809, J$.R(793, 'module', module, 2), 'exports', J$.R(801, 'processInputsAndCheckHash', processInputsAndCheckHash, 1), 0));
            J$.X1(857, J$.F(849, J$.R(825, 'processInputsAndCheckHash', processInputsAndCheckHash, 1), 0)(J$.T(833, 1, 22, false), J$.T(841, 2, 22, false)));
        } catch (J$e) {
            J$.Ex(985, J$e);
        } finally {
            if (J$.Sr(993)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
