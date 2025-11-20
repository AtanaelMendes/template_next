import { useCallback, useEffect, useState } from "react";
import InputTextArea from '../inputs/InputTextArea';
import Button from '@/components/buttons/Button';
import InputMonth from "../inputs/InputMonth";
import InputText from '../inputs/InputText';
import { empty } from "@/assets/utils";
import Select from "../inputs/Select";

const CardNovoCurso = ({ id, onChange, deleteCardFunction }) => {
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);
    const [showDataConclusao, setShowDataConclusao] = useState(false);
    const [showCargaHoraria, setShowCargaHoraria] = useState(false);
    const [dadosNovoCurso, setDadosNovoCurso] = useState({
        nm_pessoa_estab_ensino: "",
        dt_conclusao_curso: "",
        nr_carga_horaria: "",
        ds_observacoes: "",
        id_situacao: "",
        cd_nivel: "",
        ds_serie: "",
        nm_curso: "",
    });

    const setdadosNovoCursoCallback = useCallback((id, value) => {
        setDadosNovoCurso(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(dadosNovoCurso);
        }
    }, [dadosNovoCurso]);

    useEffect(() => {
        let ensinoTecnico = 3;
        let extraCurricular = 9;

        //Exibe mais campos caso ensino técnico ou nível mais alto
        setShowAdvancedFields(dadosNovoCurso.cd_nivel >= ensinoTecnico);

        //Exibe o campo de carga horário apenas para curso extra-curricular
        setShowCargaHoraria(dadosNovoCurso.cd_nivel == extraCurricular);
    }, [dadosNovoCurso.cd_nivel]);

    useEffect(() => {
        let concluido = 'C';
        let cursando = 'A';

        //Concluido ou Cursando exibe a data de conclusão
        setShowDataConclusao(dadosNovoCurso.id_situacao == concluido || dadosNovoCurso.id_situacao == cursando);
    }, [dadosNovoCurso.id_situacao]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                Adicionar curso/formação
            </div>
            <div className={"p-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 mt-2">
                    <div className={`col-span-4`}>
                        <Select
                            label="Grau de formação:"
                            options={[
                                { value: 1, label: "Ensino Fundamental" },
                                { value: 2, label: "Ensino Médio" },
                                { value: 3, label: "Ensino Técnico" },
                                { value: 4, label: "Ensino Superior" },
                                { value: 5, label: "Especialização/MBA" },
                                { value: 6, label: "Mestrado" },
                                { value: 7, label: "Doutorado" },
                                { value: 8, label: "Pos Doutorado" },
                                { value: 9, label: "Curso Extracurricular" },
                            ]}
                            hideClearButton
                            id={`${id}_cd_nivel`}
                            placeholder={"Selecione"}
                            value={dadosNovoCurso.cd_nivel}
                            onChange={(id, value) => setdadosNovoCursoCallback("cd_nivel", value)}
                        />
                    </div>
                    <div className={`${showDataConclusao || showCargaHoraria ? (!showDataConclusao && showCargaHoraria ? "col-span-4" : "col-span-6") : "col-span-4"}`}>
                        <Select
                            label="Situação:"
                            options={[
                                { value: 'C', label: "Concluído" },
                                { value: 'T', label: "Trancado" },
                                { value: 'A', label: "Cursando" },
                                { value: 'D', label: "Desistente" },
                            ]}
                            hideClearButton
                            id={`${id}_id_situacao`}
                            placeholder={"Selecione"}
                            value={dadosNovoCurso.id_situacao}
                            onChange={(id, value) => setdadosNovoCursoCallback("id_situacao", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showDataConclusao ? "" : "hidden"}`}>
                        <InputMonth
                            label={"Data de conclusão:"}
                            id={`${id}_dt_conclusao_curso`}
                            value={dadosNovoCurso.dt_conclusao_curso}
                            onChange={(id, value) => setdadosNovoCursoCallback("dt_conclusao_curso", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showCargaHoraria ? "" : "hidden"}`}>
                        <InputText
                            mask={"numeric"}
                            label={"Carga Horária:"}
                            id={`${id}_nr_carga_horaria`}
                            value={dadosNovoCurso.nr_carga_horaria}
                            onChange={(id, value) => setdadosNovoCursoCallback("nr_carga_horaria", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showCargaHoraria ? "hidden" : ""}`}>
                        <InputText
                            maxLength={15}
                            label={"Série:"}
                            id={`${id}_ds_serie`}
                            value={dadosNovoCurso.ds_serie}
                            onChange={(id, value) => setdadosNovoCursoCallback("ds_serie", value)}
                        />
                    </div>
                    <div className={`col-span-12`}>
                        <InputText
                            maxLength={80}
                            label={"Nome da Instituição:"}
                            id={`${id}_nm_pessoa_estab_ensino`}
                            value={dadosNovoCurso.nm_pessoa_estab_ensino}
                            onChange={(id, value) => setdadosNovoCursoCallback("nm_pessoa_estab_ensino", value)}
                        />
                    </div>
                    <div className={`col-span-6 ${showAdvancedFields ? "" : "hidden"}`}>
                        <InputText
                            maxLength={80}
                            id={`${id}_nm_curso`}
                            label={"Nome do curso:"}
                            value={dadosNovoCurso.nm_curso}
                            onChange={(id, value) => setdadosNovoCursoCallback("nm_curso", value)}
                        />
                    </div>
                    <div className={`col-span-12 ${showAdvancedFields ? "" : "hidden"}`}>
                        <InputTextArea
                            rows="4"
                            maxLength={2000}
                            label={"Descrição:"}
                            id={`${id}_ds_observacoes`}
                            value={dadosNovoCurso.ds_observacoes}
                            onChange={(id, checked) => setdadosNovoCursoCallback("ds_observacoes", checked)}
                        />
                    </div>
                    <div className={"flex col-span-12 justify-center"}>
                        <Button buttonType="danger" size="small" onClick={() => { deleteCardFunction() }}>
                            Remover formação
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CardEditCurso = ({ id, dados, onChange, deleteCardFunction }) => {
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);
    const [showDataConclusao, setShowDataConclusao] = useState(false);
    const [showCargaHoraria, setShowCargaHoraria] = useState(false);
    const [skipEffect, setSkipEffect] = useState(true);
    const [dadosCurso, setDadosCurso] = useState({
        nm_pessoa_estab_ensino: "",
        dt_conclusao_curso: "",
        nr_carga_horaria: "",
        ds_observacoes: "",
        id_situacao: "",
        cd_nivel: "",
        ds_serie: "",
        nm_curso: "",
    });

    const setDadosEmpregoCallback = useCallback((id, value) => {
        setSkipEffect(false);
        setDadosCurso(prevState => ({ ...prevState, [id]: value }));
    });

    useEffect(() => {
        if (skipEffect) {
            setSkipEffect(true);
            return;
        }

        if (typeof onChange === "function") {
            onChange(dadosCurso);
        }
    }, [dadosCurso]);

    useEffect(() => {
        //Ao carregar os valores do card salvo, não disparar a atualização do objeto do componente pai
        setSkipEffect(true);

        if (!empty(dados)) {
            setDadosCurso(dados);
        }
    }, [dados]);

    useEffect(() => {
        const ensinoTecnico = 3;
        const extraCurricular = 9;

        //Exibe mais campos caso ensino técnico ou nível mais alto
        setShowAdvancedFields(dadosCurso.cd_nivel >= ensinoTecnico);

        //Exibe o campo de carga horário apenas para curso extra-curricular
        setShowCargaHoraria(dadosCurso.cd_nivel == extraCurricular);
    }, [dadosCurso.cd_nivel]);

    useEffect(() => {
        const cursando = 'A';
        const concluido = 'C';

        //Concluido ou Cursando exibe a data de conclusão
        setShowDataConclusao(dadosCurso.id_situacao == concluido || dadosCurso.id_situacao == cursando);
    }, [dadosCurso.id_situacao]);

    return (
        <div className="mb-3">
            <div className={`bg-blue-600 text-white font-semibold rounded-t-lg px-4 text-sm py-1`}>
                {dadosCurso.card_title}
            </div>
            <div className={"p-2 border rounded-b-lg"}>
                <div className="grid grid-cols-12 w-full gap-x-2 gap-y-5 mt-2">
                    <div className={`col-span-6`}>
                        <Select
                            label="Grau de formação:"
                            options={[
                                { value: '1', label: "Ensino Fundamental" },
                                { value: '2', label: "Ensino Médio" },
                                { value: '3', label: "Ensino Técnico" },
                                { value: '4', label: "Ensino Superior" },
                                { value: '5', label: "Especialização/MBA" },
                                { value: '6', label: "Mestrado" },
                                { value: '7', label: "Doutorado" },
                                { value: '8', label: "Pos Doutorado" },
                                { value: '9', label: "Curso Extracurricular" },
                            ]}
                            hideClearButton
                            id={`${id}_cd_nivel`}
                            placeholder={"Selecione"}
                            value={dadosCurso.cd_nivel}
                            onChange={(id, value) => setDadosEmpregoCallback("cd_nivel", value)}
                        />
                    </div>
                    <div className={`col-span-6`}>
                        <Select
                            label="Situação:"
                            options={[
                                { value: 'C', label: "Concluído" },
                                { value: 'T', label: "Trancado" },
                                { value: 'A', label: "Cursando" },
                                { value: 'D', label: "Desistente" },
                            ]}
                            hideClearButton
                            id={`${id}_id_situacao`}
                            placeholder={"Selecione"}
                            value={dadosCurso.id_situacao}
                            onChange={(id, value) => setDadosEmpregoCallback("id_situacao", value)}
                        />
                    </div>
                    <div className={`col-span-12 ${showAdvancedFields ? "" : "hidden"}`}>
                        <InputText
                            maxLength={80}
                            id={`${id}_nm_curso`}
                            label={"Nome do curso:"}
                            value={dadosCurso.nm_curso}
                            onChange={(id, value) => setDadosEmpregoCallback("nm_curso", value)}
                        />
                    </div>

                    <div className={`col-span-12`}>
                        <InputText
                            maxLength={80}
                            label={"Nome da Instituição:"}
                            id={`${id}_nm_pessoa_estab_ensino`}
                            value={dadosCurso.nm_pessoa_estab_ensino}
                            onChange={(id, value) => setDadosEmpregoCallback("nm_pessoa_estab_ensino", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showDataConclusao ? "" : "hidden"}`}>
                        <InputMonth
                            label={"Data de conclusão:"}
                            id={`${id}_dt_conclusao_curso`}
                            value={dadosCurso.dt_conclusao_curso}
                            onChange={(id, value) => setDadosEmpregoCallback("dt_conclusao_curso", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showCargaHoraria ? "" : "hidden"}`}>
                        <InputText
                            mask={"numeric"}
                            label={"Carga Horária:"}
                            id={`${id}_nr_carga_horaria`}
                            value={dadosCurso.nr_carga_horaria}
                            onChange={(id, value) => setDadosEmpregoCallback("nr_carga_horaria", value)}
                        />
                    </div>

                    <div className={`col-span-4 ${showCargaHoraria ? "hidden" : ""}`}>
                        <InputText
                            maxLength={15}
                            label={"Série:"}
                            id={`${id}_ds_serie`}
                            value={dadosCurso.ds_serie}
                            onChange={(id, value) => setDadosEmpregoCallback("ds_serie", value)}
                        />
                    </div>

                    <div className={`col-span-12 ${showAdvancedFields ? "" : "hidden"}`}>
                        <InputTextArea
                            rows="4"
                            maxLength={2000}
                            label={"Descrição:"}
                            id={`${id}_ds_observacoes`}
                            value={dadosCurso.ds_observacoes}
                            onChange={(id, checked) => setDadosEmpregoCallback("ds_observacoes", checked)}
                        />
                    </div>
                    <div className={"flex col-span-12 justify-center"}>
                        <Button buttonType="danger" size="small" onClick={() => { deleteCardFunction() }}>
                            Remover formação
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CardNovoCurso, CardEditCurso };