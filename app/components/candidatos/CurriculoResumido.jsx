import HistoticoVagaCandidato from "@/components/candidatos/HistoricoVagaCandidato";
import { Caption, Subtitle, Title, Label } from "@/components/Layouts/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import PillsBadge from "@/components/buttons/PillsBadge";
import {useEffect, useMemo, useState } from "react";
import WhatsappButton from "../buttons/WhatsappButton";
import { useAppContext } from "@/context/AppContext";
import NoDataFound from "../Layouts/NoDataFound";
import axiosInstance, { axios } from "@/plugins/axios";
import Button from "../buttons/Button";
import { empty } from "@/assets/utils";
import Select2Vaga from "@/components/inputs/Select2Vaga";

const CurriculoResumido = ({ cdPessoaCandidato, closeCallback, hoverable, tabName }) => {
    const [modalHisoticoVagaControl, setModalHisoticoVagaControl] = useState(false);
    const [viewHistorico, setViewHistorico] = useState(false);
    const [dadosCandidato, setDadosCandidato] = useState({});
    const [nrVagaRelaciona, setNrVagaRelaciona] = useState("");
    const [tabs, setTabs] = useState({
        curriculo_resumido: { visible: true },
        relaciona_vaga: { visible: false },
    });
    const { toast, setLastTab, openPageTab } = useAppContext();

    useEffect(() => {
        if (!cdPessoaCandidato) return;

        axiosInstance.get('/candidato/curriculo-resumido/' + cdPessoaCandidato)
            .then((response) => {
                setDadosCandidato(response.data);
            })
            .catch((error) => {
                if (error?.text) {
                    return toast.error(error?.text);
                }
                return toast.error("Erro ao buscar dados do candidato");
            });
    }, [cdPessoaCandidato]);

    const viewCurriculoCompleto = () => {
        setLastTab(tabName);
        openPageTab({
            id: "DadosCandidato",
            name: `Dados do candidato`,
            props: {
                cdPessoaCandidato: cdPessoaCandidato,
                nm_tab: tabName
            },
        });
    };

    const handleClose = () => {
        if (typeof closeCallback === "function") {
            closeCallback();
        }
    };

    const toogleRelacionaCandidatoNaVaga = (visible) => {
        setTabs(prevState => ({
            curriculo_resumido: { visible: !visible },
            relaciona_vaga: { visible: visible }
        }));
    };

    const relacionCandiato = () => {
        axiosInstance.post(`vaga/relacionar-candidato`, {
            nr_vaga: nrVagaRelaciona,
            cd_pessoa_candidato: cdPessoaCandidato,
            cd_estagio_vaga: 3
        }).then((response) => {
            setNrVagaRelaciona("");
            toast.success("Relacionado com sucesso!");
            toogleRelacionaCandidatoNaVaga(false);
        }).catch((error) => {
            if (error?.text) {
                return toast.error(error?.text);
            }
            return toast.error("Erro ao relacionar candidato");
        });
    }

    const renderRelacionaCandidato = useMemo(() => {
        if (Object.keys(dadosCandidato)?.length === 0) return <NoDataFound />;
        const { pessoa } = dadosCandidato;
        return (
            <div className={`flex-col relative h-[80vh] shadow-lg border border-slate-400 rounded-lg mx-auto mt-6 w-1/2 shadow-blue-600 overflow-y-auto overflow-x-hidden bg-white ${tabs.relaciona_vaga.visible ? "" : "hidden"}`}>
                <div className="flex-row mt-2 px-2">
                    <div>
                        <Title>{pessoa.NM_PESSOA}</Title> <Label className={"text-slate-500"}>({pessoa.IDADE} anos)</Label> <Label className="font-semibold">{pessoa.DS_ESTADO_CIVIL}</Label>
                    </div>
                </div>
                <div className="flex-col px-2">
                    <Select2Vaga label="Relacionar a vaga" onChange={(value) => setNrVagaRelaciona(value)} tipoVaga="vagas_selecao" placeholder="nome do cargo ou cliente" isClearable={true}/>
                </div>
                <div className="flex flex-col p-2 absolute bottom-0 bg-white w-full border-t mt-2 border-slate-300 h-fit">
                    <div className="flex w-full flex-row-reverse gap-x-1">
                        <div>
                            <Button buttonType={"danger"} outline={true} onClick={() => { toogleRelacionaCandidatoNaVaga(false); setNrVagaRelaciona("") }} size="small" >
                                CANCELAR
                            </Button>
                        </div>
                        <div>
                            <Button buttonType={"success"} onClick={relacionCandiato} size="small" disabled={empty(nrVagaRelaciona)}>
                                SALVAR
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [cdPessoaCandidato, dadosCandidato, tabs, nrVagaRelaciona]);

    const curriculoToHtml = useMemo(() => {
        if (Object.keys(dadosCandidato)?.length === 0) return <NoDataFound />;
        const { pessoa, pretensao, experiencia, formacao, cursos } = dadosCandidato;

        const renderExperiencia = () => {
            return experiencia
                ?.sort((a, b) => {
                    const dateA = a.DT_INICIO ? new Date(a.DT_INICIO.split('/').reverse().join('-')) : new Date(0);
                    const dateB = b.DT_INICIO ? new Date(b.DT_INICIO.split('/').reverse().join('-')) : new Date(0);
                    return dateB - dateA;
                })
                .map((exp, index) => {
                    return (
                        <div className="flex-col px-4 mt-2" key={`exp_${index}`}>
                            <div className="flex-row">
                                <div>
                                    <Subtitle className={`bg-slate-200 font-semibold px-2`}>
                                        {exp.NM_PESSOA_EMPRESA}
                                    </Subtitle>
                                    <Label>{exp.DT_INICIO}</Label> <Label>a {exp.DT_FIM || "Atual"}</Label>
                                </div>
                                <div className="flex flex-row w-full">
                                    <div className="w-2/3">
                                        <Caption>Cargo:</Caption> <Label className={`italic`}>{exp.NM_CARGO}</Label>
                                    </div>
                                    <div className="w-1/3">
                                        <Caption>Salário:</Caption> <Label className={`text-primary`}>{exp.ULTIMO_SALARIO}</Label>
                                    </div>
                                </div>
                                <div
                                    className={`text-base text-justify text-slate-400 hover:text-black hover:text-shadow-sm [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5`}
                                    dangerouslySetInnerHTML={{ __html: exp.DS_EXPERIENCIA_PROFISSIONAL }}
                                />
                            </div>
                        </div>
                    );
                });
        };


        const renderFormacao = () => {
            return formacao?.map((formacao, index) => {
                return (
                    <div className="flex-col px-4 mt-2" key={`formacao_${index}`}>
                        <div className="flex-row">
                            <div>
                                <Subtitle className={`bg-slate-200 font-semibold px-2`}>{formacao.NM_CURSO}</Subtitle>
                            </div>
                            <div>
                                <Label className={`font-semibold`}>{formacao.NM_GRAU_INSTRUCAO}</Label> <Caption>Conclusão:</Caption> <Label>{formacao.DT_CONCLUSAO_formacao}</Label>
                            </div>
                            <div>
                                <Label>{formacao.NM_PESSOA_ESTAB_ENSINO}</Label>
                            </div>
                            <div className="text-base text-justify text-slate-400 hover:text-slate-600">
                                {formacao.DS_OBSERVACOES}
                            </div>
                        </div>
                    </div>
                );
            });
        };

        const renderCursos = () => {
            return cursos?.map((curso, index) => {
                return (
                    <div className="flex-col px-4 mt-2" key={`curso_${index}`}>
                        <div className="flex-row">
                            <div>
                                <Subtitle className={`bg-slate-200 font-semibold px-2`}>{curso.NM_CURSO}</Subtitle>
                            </div>
                            <div>
                                <Caption>Conclusão:</Caption> <Label>{curso.DT_CONCLUSAO_CURSO}</Label>
                            </div>
                            <div>
                                <Label>{curso.NM_PESSOA_ESTAB_ENSINO}</Label>
                            </div>
                            <div className="text-base text-justify text-slate-400 hover:text-slate-600">
                                {curso.DS_OBSERVACOES}
                            </div>
                        </div>
                    </div>
                );
            });
        };

        return (
            <>
                <div className="max-h-full overflow-y-auto">
                    <div className="flex-col px-2">
                        <div className="flex-row mt-2">
                            <div>
                                <Title>{pessoa.CD_PESSOA}</Title> - <Title>{pessoa.NM_PESSOA}</Title> <Label className={"text-slate-500"}>({pessoa.IDADE} anos)</Label> <Label className="font-semibold">{pessoa.DS_ESTADO_CIVIL}</Label>
                                {pessoa.ID_PCD === 'S' && (
                                    <PillsBadge
                                    type="warning"
                                    className="inline-flex items-center ml-2">
                                    PCD
                                    <FontAwesomeIcon
                                        icon={faWheelchair}
                                        width="12"
                                        height="12"
                                        className='ml-1'
                                    />
                                </PillsBadge>
                                )}
                            </div>
                        </div>
                        <div className="flex-row pl-2">
                            <div className={`${pessoa?.NM_PESSOA_SOCIAL ? "" : "hidden"}`}>
                                <Caption>Nome social:</Caption> <Label>{pessoa.NM_PESSOA_SOCIAL}</Label>
                            </div>
                            <div className={`${pessoa?.NR_CPF ? "" : "hidden"}`}>
                                <Caption>CPF:</Caption> <Label>{pessoa.NR_CPF}</Label>
                            </div>
                            <div className={`${pessoa?.NR_CELULAR ? "" : "hidden"}`}>
                                <Caption>Celular:</Caption> <Label>{pessoa.NR_CELULAR}</Label>
                            </div>
                            <div className={`${pessoa?.NR_RESIDENCIAL ? "" : "hidden"}`}>
                                <Caption>Residencial:</Caption> <Label>{pessoa.NR_RESIDENCIAL}</Label>
                            </div>
                            <div className={`${pessoa?.NR_RECADO ? "" : "hidden"}`}>
                                <Caption>Recado:</Caption> <Label>{pessoa.NR_RECADO}</Label>
                            </div>
                            <div className={`${pessoa?.PRETENSAO_SALARIAL ? "" : "hidden"}`}>
                                <Caption>Pretensão salarial:</Caption> <Label className={"text-primary"}>{pretensao.PRETENSAO_SALARIAL}</Label>
                            </div>
                            <div className={`${pessoa?.NM_CIDADE ? "" : "hidden"}`}>
                                <Caption>Cidade / UF:</Caption> <Label className={""}>{`${pessoa.NM_CIDADE} / ${pessoa.CD_UF}`}</Label>
                            </div>
                            <div className={`${pessoa?.NM_BAIRRO ? "" : "hidden"}`}>
                                <Caption>Bairro:</Caption> <Label className={""}>{pessoa.NM_BAIRRO}</Label>
                            </div>
                        </div>
                    </div>

                    <div className={`flex-col border-t mt-2 border-slate-300 px-2 ${dadosCandidato?.experiencia?.length > 0 ? "" : "hidden"}`}>
                        <Title className={"text-slate-500"}>Experiência Profissional</Title>
                    </div>
                    {renderExperiencia()}

                    <div className={`flex-col border-t mt-2 border-slate-300 px-2 ${dadosCandidato?.formacao?.length > 0 ? "" : "hidden"}`}>
                        <Title className={"text-slate-500"}>Formação Acadêmica</Title>
                    </div>
                    {renderFormacao()}

                    <div className={`flex-col border-t mt-2 border-slate-300 px-2 ${dadosCandidato?.cursos?.length > 0 ? "" : "hidden"}`}>
                        <Title className={"text-slate-500"}>Cursos Extracurriculares</Title>
                    </div>
                    {renderCursos()}

                    {/* Nao remova, ta aquio pra gerar um espaço em branco no final cv pra nao ocultar conteuno atras das acoes rapidas */}
                    <div className="flex flex-col pb-100" />
                </div>

                <div className="flex flex-col p-2 absolute bottom-0 bg-white w-full border-t mt-2 border-slate-300">
                    <div className="flex flex-row-reverse w-full">
                        <div className="inline-flex w-fit">
                            <WhatsappButton className="ml-1 xl:ml-2" nrTelefone={pessoa.NR_CELULAR} />
                            <Button buttonType={"primary"} pill className="flex items-center ml-1 xl:ml-2 shadow-md shadow-blue-600 w-[35px] h-[35px] p-[7px]" onClick={() => { setViewHistorico(true); setModalHisoticoVagaControl(true); }}>
                                <FontAwesomeIcon icon={faHistory} width="16" height="16" className="text-lg translate-x-0.5" />
                            </Button>
                            <Button
                                size="small"
                                buttonType="primary"
                                outline={true}
                                className="ml-1 xl:ml-2"
                                onClick={() => {
                                    viewCurriculoCompleto();
                                    setLastTab("SelecaoEntrar");
                                }}
                            >
                                CURRÍCULO COMPLETO
                            </Button>
                            <Button
                                size="small"
                                buttonType="primary"
                                outline={true}
                                className="ml-1 xl:ml-2"
                                onClick={() => {
                                    toogleRelacionaCandidatoNaVaga(true);
                                }}
                            >
                                RELACIONAR
                            </Button>
                            <Button buttonType={"danger"} outline={true} onClick={handleClose} size="small" className={`${!hoverable ? "" : "hidden"}`}>
                                FECHAR
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }, [cdPessoaCandidato, dadosCandidato, modalHisoticoVagaControl]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-screen max-h-screen overflow-hidden z-50  ${!empty(cdPessoaCandidato) ? "" : "hidden"}`}>
            <div
                onClick={(e) => { e.stopPropagation(); }}
                className={`relative top-5 mx-auto my-auto border border-slate-400 flex-col h-[80vh] shadow-lg rounded-lg w-1/2 shadow-blue-600  overflow-hidden bg-white ${tabs.curriculo_resumido.visible ? "" : "hidden"}`}>
                {curriculoToHtml}
                <HistoticoVagaCandidato cdPessoaCandidato={cdPessoaCandidato} nmCandidato={dadosCandidato?.pessoa?.NM_PESSOA || ""} init={viewHistorico} modalHisoticoVagaControl={modalHisoticoVagaControl} setModalHisoticoVagaControl={setModalHisoticoVagaControl} />
            </div>
            {renderRelacionaCandidato}
        </div>
    );
};
export default CurriculoResumido;