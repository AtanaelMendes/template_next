import { useState, useEffect } from "react";
import RadioGroup from "../inputs/RadioGroup";
import { useAppContext } from "@/context/AppContext";
import Loading from "../Layouts/Loading";
import axiosInstance from "@/plugins/axios";

const TesteConfiabilidade = ({
    active,
    cdPessoaCandidato,
    idAvaliacao,
    handleSave,
    handleSaveFn,
    afterSaveCallback,
}) => {
    const [resultadoTeste, setResultadoTeste] = useState(
        <div className="text-sm">Sem dados para calcular...</div>
    );
    const [valorRespostasPerguntas, setValorRespostasPerguntas] = useState({});
    const [valorRespostasCalculo, setValorRespostasCalculo] = useState({});
    const [showLoading, setShowLoading] = useState(false);
    const { toast } = useAppContext();
    const [pontuacao, setPontuacao] = useState({});
    const [notaTotal, setNotaTotal] = useState({});
    const [notaFinal, setNotaFinal] = useState({});
    const [dadosTeste, setDadosTeste] = useState();
    const valorBaixo = 0.25;
    const valorMedio = 1.25;
    const valorAlto = 2.5;

    //Armazena os valores selecionados nos radios das perguntas, agrupado por grupo de pergunta
    const setOpcaoSelecionada = (idGrupo, idPergunta, valorResposta) => {
        //Atualiza o objeto utilizado para os calculos
        setValorRespostasCalculo((prevPerguntas) => ({
            ...prevPerguntas,
            [idGrupo]: {
                ...prevPerguntas[idGrupo],
                [idPergunta]: valorResposta,
            },
        }));

        //Atualiza o objeto onde as chaves são o ID da pergunta, facilitando o controle do que foi respondido e do que salvar/atualizar
        setValorRespostasPerguntas((prevDados) => ({
            ...prevDados,
            [idPergunta]: {
                ...prevDados[idPergunta],
                nr_nota:
                    valorResposta == valorBaixo ? "1" : valorResposta == valorMedio ? "5" : "10",
            },
        }));
    };

    useEffect(() => {
        if (Object.keys(valorRespostasCalculo).length > 0) {
            calculaNotas();
        }
    }, [valorRespostasCalculo]);

    //Faz o calculo da resposta onde a pontuação é a soma das respostas
    // e a nota total é 1 (se a pontuação for menor ou igual a 2)
    // ou a nota total é 5 (se a pontuação for maior que 2 e menor ou igual a 5)
    // ou a nota total é 10 (se a pontuação for maior que 5)
    const calculaNotas = () => {
        let objPontuacao = {};
        let objTotal = {};

        Object.keys(valorRespostasCalculo).forEach((key, index) => {
            objPontuacao[key] = {};
            objTotal[key] = {};
            let notaTotalTmp = 0;

            let valores = Object.values(valorRespostasCalculo[key]);
            const notaPontuacaoTmp = valores.reduce(
                (somatemp, valorAtual) => somatemp + (valorAtual || 0),
                0
            );
            if (notaPontuacaoTmp > 0) {
                notaTotalTmp =
                    notaPontuacaoTmp <= 2
                        ? 1
                        : notaPontuacaoTmp > 2 && notaPontuacaoTmp <= 5
                        ? 5
                        : 10;
            }

            objPontuacao[key] = notaPontuacaoTmp;
            objTotal[key] = notaTotalTmp;
        });

        setPontuacao(objPontuacao);
        setNotaTotal(objTotal);
    };

    useEffect(() => {
        if (Object.keys(notaTotal).length > 0) {
            calculaResultado();
        }
    }, [notaTotal]);

    const calculaResultado = () => {
        let valores = Object.values(notaTotal);
        const notaTotalCalc = valores.reduce(
            (valorCalculado, valorAtual) => valorCalculado * valorAtual,
            1
        );

        let nota = "";
        if (notaTotalCalc < 25) {
            nota = "C";
        } else if (notaTotalCalc < 500) {
            nota = "B";
        } else if (notaTotalCalc < 1000) {
            nota = "A";
        } else {
            nota = "AA";
        }

        setNotaFinal(notaTotalCalc);
        let existemPerguntasNaoPreenchidas = Object.values(valorRespostasPerguntas).some(
            (item) => item.nr_nota === ""
        );
        let finalOuParcial = existemPerguntasNaoPreenchidas ? "parcial" : "final";
        setResultadoTeste(
            <div className="text-md">
                <span className="font-medium">Nota {finalOuParcial}:</span>
                <span className={"px-2 text-primary font-bold"}>
                    {notaTotalCalc.toLocaleString()}
                </span>
                <span>({nota})</span>
            </div>
        );
    };

    useEffect(() => {
        if (active) {
            handleSaveFn(false);
            setShowLoading(true);
            getDadosTesteConfiabilidade();
        }
    }, [active]);

    const getDadosTesteConfiabilidade = () => {
        axiosInstance
            .get(`teste/dados-teste-confiabilidade/${idAvaliacao || 0}/${cdPessoaCandidato}`)
            .then(function (response) {
                setDadosTeste(response.data.dados || []);
                setValorRespostasCalculo(response.data.respostas);
                setValorRespostasPerguntas(response.data.perguntas);
                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Não foi possível carregar os dados do teste de confiabilidade.");
                console.error(error);
            });
    };

    useEffect(() => {
        if (handleSave) {
            //Valida se todas as perguntas foram respondidas
            let existemPerguntasNaoPreenchidas = Object.values(valorRespostasPerguntas).some(
                (item) => item.nr_nota == ""
            );
            if (existemPerguntasNaoPreenchidas) {
                toast.error("Todas as perguntas devem ser respondidas!");

                //Volta o estado do botão Salvar
                //setTimeout usado para evitar o bloqueio do estado do botão
                setTimeout(() => {
                    handleSaveFn(false);
                }, 500);
            } else {
                handleSaveButton();
            }
        }
    }, [handleSave]);

    const handleSaveButton = () => {
        setShowLoading(true);

        let data = new FormData();
        data.append("cd_pessoa_candidato", cdPessoaCandidato);
        data.append("id_avaliacao", idAvaliacao || 0);
        data.append("notas", JSON.stringify(valorRespostasPerguntas));
        data.append("nota_final", notaFinal);

        axiosInstance
            .post("teste/salvar-teste-confiabilidade", data)
            .then(function (response) {
                if (response.status === 200) {
                    //Se foi salvo sem erros
                    if (response.data.status == 1) {
                        setShowLoading(false);
                        afterSaveCallback();
                        return toast.success(response.data.message);
                    }

                    //Se houve algum erro ao salvar
                    setShowLoading(false);
                    return toast.error(response.data.message);
                }
                setShowLoading(false);
            })
            .catch(function (error) {
                setShowLoading(false);
                toast.error("Erro ao salvar teste de confiabilidade.");
                console.error(error);
            });
    };

    const renderTesteConfiabilidade = () => {
        if (!dadosTeste) {
            return "Dados não recebidos";
        }

        let perguntas = "";
        let objTeste = [];

        Object.keys(dadosTeste).forEach((key, index) => {
            perguntas = dadosTeste[key].map((pergunta, index) => (
                <div
                    className={`border-r border-l odd:bg-white even:bg-gray-100 divide-y divide-gray-200`}
                >
                    <div className={`flex px-1 divide-x divide-gray-300`}>
                        <div className={`pl-2 py-1 w-[60%] flex items-center`}>
                            {pergunta.DS_PERGUNTA}
                        </div>
                        <div className={`pl-2 w-[40%] flex items-center`}>
                            {pergunta.NM_TESTE_APLICADO}
                        </div>
                        <div className={`flex justify-end items-center w-[170px]`}>
                            <RadioGroup
                                active={active}
                                key={pergunta.ID}
                                name={pergunta.ID}
                                items={[
                                    {
                                        id: `option_${key}_1`,
                                        action: () =>
                                            setOpcaoSelecionada(key, pergunta.ID, valorBaixo),
                                        checked:
                                            valorRespostasCalculo?.[key]?.[pergunta.ID] ==
                                            valorBaixo,
                                        label: "Baixo",
                                    },
                                    {
                                        id: `option_${key}_2`,
                                        action: () =>
                                            setOpcaoSelecionada(key, pergunta.ID, valorMedio),
                                        checked:
                                            valorRespostasCalculo?.[key]?.[pergunta.ID] ==
                                            valorMedio,
                                        label: "Médio",
                                    },
                                    {
                                        id: `option_${key}_3`,
                                        action: () =>
                                            setOpcaoSelecionada(key, pergunta.ID, valorAlto),
                                        checked:
                                            valorRespostasCalculo?.[key]?.[pergunta.ID] ==
                                            valorAlto,
                                        label: "Alto",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            ));

            objTeste.push(
                <div key={index} className={`m-4 shadow-lg`}>
                    <div
                        className={`px-4 rounded-t-md bg-primary text-white w-full text-md font-semibold flex items-center`}
                    >
                        <div className={`pl-2 py-1 w-[60%]`}>
                            {key} - {dadosTeste[key][0]["DS_CLASSIFICACAO_AVALIACAO"]}
                        </div>
                        <div className={`pl-2 text-sm w-[40%]`}>Teste/Avaliação Aplicado</div>
                    </div>

                    {perguntas}

                    <div
                        className={`px-4 rounded-b-md bg-slate-200 text-slate-700 w-full flex justify-center items-center`}
                    >
                        <div className="font-medium">Pontuação:</div>
                        <div className={`ml-2 text-primary font-bold`}>{pontuacao[key] || 0}</div>
                        <div className={`ml-4 font-medium`}>Total:</div>
                        <div className={`ml-2 text-primary font-bold`}>{notaTotal[key] || 0}</div>
                    </div>
                </div>
            );
        });

        return objTeste;
    };

    const renderCardResultado = () => {
        return (
            <div className={`flex justify-center mb-4`}>
                <div className={`w-1/3 text-center border rounded shadow-lg`}>
                    <div
                        className={`px-4 rounded-t-md bg-primary text-white w-full text-md font-semibold`}
                    >
                        Resultado:
                    </div>

                    <div className={`m-1 font-bold`}>{resultadoTeste}</div>

                    <div
                        className={`px-4 py-1 rounded-b-md bg-slate-200 text-slate-600 w-full flex justify-center font-semibold items-center`}
                    >
                        <span className={`text-sm`}>Legenda:</span>
                        <span className={`text-xs ml-4`}>TOTAL: WR = H1 * H2 * H3 * H4</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`col-span-12 h-[680px] relative ${!active ? "hidden" : ""}`}>
            <Loading active={showLoading} className={"sticky"} />
            {renderTesteConfiabilidade()}
            {renderCardResultado()}
        </div>
    );
};

export default TesteConfiabilidade;
