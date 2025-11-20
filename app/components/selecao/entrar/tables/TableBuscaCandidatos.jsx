import CurriculoResumido from "@/components/candidatos/CurriculoResumido";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Caption } from "@/components/Layouts/Typography";
import { useCallback, useState, Fragment } from "react";
import Clipboard from "@/components/Layouts/Clipboard";
import InputText from "@/components/inputs/InputText";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";

const TableBuscaCandidatos = ({ candidatos, setCandidatoTextFilter, isLoading, tabName }) => {
    const [cdPessoaCurriculoResumido, setCdPessoaCurriculoResumido] = useState("");
    const { openPageTab } = useAppContext();

    const handleFilterText = useCallback(
        (id, value) => {
            setCandidatoTextFilter(value);
        },
        [setCandidatoTextFilter]
    );

    const editarDadosCandidato = useCallback(
        (cd_pessoa_candidato) => {
            openPageTab({
                id: "DadosCandidato",
                name: `Dados do candidato`,
                props: {
                    cdPessoaCandidato: cd_pessoa_candidato,
                    nm_tab: tabName,
                },
            });
        },
        [openPageTab]
    );

    const curriculoResumidoCallback = () => {
        setCdPessoaCurriculoResumido("");
    };

    const RenderCandidatos = useCallback(() => {
        if (isLoading) return <NoDataFound isLoading={isLoading}/>
        return candidatos.map((candidato, index) => (
            <Fragment key={`${index}`}>
                <div className="odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 flex flex-row items-center gap-4 px-1">
                    <div
                        className={`flex flex-row justify-between items-center text-sm py-1 w-full gap-1`}
                    >
                        <div className="flex flex-col w-16">
                            <Caption>Codigo:</Caption>
                            <Clipboard className="text-primary">
                                {candidato.CODIGO_PESSOA}
                            </Clipboard>
                        </div>
                        <div className="flex flex-col w-64">
                            <Caption>Nome:</Caption>
                            <span
                                className="text-primary cursor-pointer hover:underline font-semibold"
                                onClick={() => {
                                    setCdPessoaCurriculoResumido(candidato.CODIGO_PESSOA);
                                }}
                            >
                                {candidato.NOME_PESSOA}
                            </span>
                        </div>
                        <div className="flex flex-col w-28">
                            <Caption>Cidade:</Caption>
                            <div className="flex flex-row">
                                <span className="">{candidato.UF}</span>-
                                <span className="">{candidato.CIDADE}</span>
                            </div>
                        </div>
                        <div className="flex flex-col w-28">
                            <Caption>Criado em:</Caption>
                            <span className="italic">{candidato.DATA_CRIACAO}</span>
                        </div>
                        <div className="flex flex-col w-28">
                            <Caption>Alterado em:</Caption>
                            <span className="italic">
                                {candidato.ALTERADO_EM ? candidato.ALTERADO_EM : "-"}
                            </span>
                        </div>
                        <TooltipComponent content={candidato.ALTERADO_POR} asChild>
                            <div className="flex flex-col w-28">
                                <Caption>Alterado por:</Caption>
                                <span className="italic truncate">
                                    {candidato.ALTERADO_POR ? candidato.ALTERADO_POR : "-"}
                                </span>
                            </div>
                        </TooltipComponent>

                        <TooltipComponent content={<span className="font-semibold">Alterar Candidato</span>} asChild>
                            <div className="flex flex-col w-12">
                                <Button
                                    className={"mr-2"}
                                    buttonType="primary"
                                    size="small"
                                    outline
                                    bordered={true}
                                    onClick={() => {
                                        editarDadosCandidato(candidato.CODIGO_PESSOA);
                                    }}
                                    id={`btn_candidatos_vaga_${candidato.CODIGO_PESSOA}`}
                                >
                                    <FontAwesomeIcon icon={faEdit} width="15" height="15" />
                                </Button>
                            </div>
                        </TooltipComponent>
                    </div>
                </div>
            </Fragment>
        ));
    }, [candidatos, isLoading]);

    return (
        <>
            <CurriculoResumido cdPessoaCandidato={cdPessoaCurriculoResumido} closeCallback={curriculoResumidoCallback} tabName={tabName} />
            <div className="grid grid-cols-12 bg-white">
                <div className="col-span-12 px-2 border-b-2 pb-4">
                    <div className="grid grid-cols-12">
                        <div className="col-start-9 col-span-4">
                            <InputText
                                placeholder="Filtrar"
                                clearable={true}
                                helperText={`Exibindo ${candidatos.length} registros`}
                                onChange={handleFilterText}
                                id="filtro-pesquisa-candidatos"
                            />
                        </div>
                    </div>
                </div>
                <div className={`col-span-12 max-h-[75vh] overflow-y-auto`}>
                    {RenderCandidatos()}
                </div>
            </div>
        </>
    );
};

export default TableBuscaCandidatos;
