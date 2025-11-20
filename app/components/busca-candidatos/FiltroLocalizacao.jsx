import { empty } from "@/assets/utils";
import SelectEstado from "@/components/inputs/SelectEstado";
import SelectPais from "@/components/inputs/SelectPais";
import { useAppContext } from "@/context/AppContext";
import { useBuscaCandidatosContext } from "@/context/BuscaCandidatosContext";
import axiosInstance from "@/plugins/axios";
import { useEffect } from "react";
import SelectTailwind from "react-tailwindcss-select";

const FiltroLocalizacao = ({ active }) => {
    const { toast, user } = useAppContext();
    const {
        handleFiltersChange,
        filters,
        cidades,
        setCidades,
        bairros,
        setBairros,
        cidadesSelecionadas,
        setCidadesSelecionadas,
        bairrosSelecionados = [],
        setBairrosSelecionados,
    } = useBuscaCandidatosContext();

    const handleGenericChange = (id, value) => {
        handleFiltersChange({ target: { name: id, value: value, type: "generic" } });
    };

    const handleChangeEstado = (id, value) => {
        const newValue = value;
        handleGenericChange(id, newValue);
        handleChangeCidades(null);
    };

    const handleChangePais = (id, value) => {
        const newValue = value;
        handleGenericChange(id, newValue);
        handleChangeEstado("estado", null);
    };

    const handleChangeBairros = (value) => {
        setBairrosSelecionados(value);
        const bairrosValues = value?.map((bairro) => bairro.value).join(",");
        handleGenericChange("bairros", bairrosValues);
    };

    const handleChangeCidades = (value) => {
        const cidadeValues = Array.isArray(value)
            ? value?.map((cidade) => cidade.value).join(",")
            : value;
    
        setCidadesSelecionadas(value);
        handleGenericChange("cidades", cidadeValues);
    
        if (!value) {
            handleChangeBairros(null);
        }
    };
    

    useEffect(() => {
        if (active) {
            (async () => {
                try {
                    const response = await axiosInstance.get(
                        `cidades/cidade-usuario/${user.cd_sip}/${user.cd_unid}`
                    );
    
                    const cidadeUsuario = [
                        {
                            value: response.data.NM_CIDADE,
                            label: response.data.NM_CIDADE,
                        },
                    ];
    
                    if (
                        !(filters?.cidades?.length || (Array.isArray(cidadesSelecionadas) && cidadesSelecionadas.length))
                    ) {
                        setCidades(cidadeUsuario);
                        handleChangeCidades(cidadeUsuario);
                    }
                } catch (error) {
                    toast.error("Não foi possível carregar as cidades.");
                    console.error(error);
                }
            })();
        }
    }, []);
    
    useEffect(() => {
        if (active && filters.estado !== "" && filters.cd_pais !== "") {
            axiosInstance
                .get(`cidades/cidades-por-estado/${filters.estado}/${filters.cd_pais}`)
                .then(function (response) {
                    const cidadesFormatadas = response.data.map((cidade) => ({
                        value: cidade.nmCidade,
                        label: cidade.nmCidade,
                    }));
                    setCidades(cidadesFormatadas);

                    if (filters?.cidades) {
                        const cidadesPesquisa = Array.isArray(filters?.cidades)
                            ? filters.cidades.map((cidade) => ({
                                value: cidade,
                                label: cidade,
                            }))
                            : filters.cidades
                                .split(",")
                                .map((cidade) => ({
                                    value: cidade,
                                    label: cidade,
                                }));
                        handleChangeCidades(cidadesPesquisa);
                    }
                })
                .catch(function (error) {
                    toast.error("Não foi possível carregar as cidades.");
                    console.error(error);
                });
        }
    }, [filters.cd_pais, filters.estado, active]);

    useEffect(() => {
        if (filters.estado !== "" && filters.cidades && filters.cidades.length > 0) {
            const joinCidadesSelecionadas = Array.isArray(filters.cidades)
                ? filters.cidades.map((cidade) => cidade.value).join(",")
                : filters.cidades;
            axiosInstance
                .get(`bairros/bairros-por-cidade/${filters.estado}/${joinCidadesSelecionadas}`)
                .then(function (response) {
                    const bairrosFormatados = response.data.map((bairro) => ({
                        value: `${bairro.nmCidade}:${bairro.nmBairro}`,
                        label: `${bairro.nmCidade} : ${bairro.nmBairro}`,
                    }));
                    setBairros(bairrosFormatados);
                    if (filters?.bairros?.length > 0) {
                        const cidadesPesquisa = filters.cidades.split(",").map((cidade) => ({
                            value: cidade,
                            label: cidade,
                        }));
                        const cidadesSelecionadasNomes = cidadesPesquisa.map(
                            (cidade) => cidade.value
                        );

                        if (filters?.bairros) {
                            if (Array.isArray(filters?.bairros)) {
                                const bairrosSelecionados = filters.bairros
                                    .filter((bairro) => {
                                        const cidade = bairro.split(":")[0];
                                        return cidadesSelecionadasNomes.includes(cidade);
                                    })
                                    .map((bairro) => ({
                                        value: bairro,
                                        label: bairro,
                                    }));
                                handleChangeBairros(bairrosSelecionados);
                                return;
                            }

                            const bairrosSelecionados = filters.bairros
                                .split(",")
                                .map((bairro) => ({
                                    value: bairro,
                                    label: bairro,
                                }));
                            handleChangeBairros(bairrosSelecionados);
                            return;
                        }
                    }
                })
                .catch(function (error) {
                    toast.error("Não foi possível carregar os bairros.");
                    console.error(error);
                });
        } else {
            handleChangeBairros(null);
        }
    }, [filters.cidades, cidadesSelecionadas]);

    useEffect(() => {
        if (!bairrosSelecionados || bairrosSelecionados.length === 0) return;

        // nomes das cidades atualmente selecionadas (array de strings)
        const cidadesAtuais = Array.isArray(filters.cidades)
            ? filters.cidades.map(c => (typeof c === "string" ? c : c.value))
            : String(filters.cidades).split(",").filter(Boolean);

        // mantém apenas bairros cuja cidade ainda está selecionada
        const filtrados = bairrosSelecionados.filter(opt => {
            const cidade = String(opt.value).split(":")[0];
            return cidadesAtuais.includes(cidade);
        });

        // se algo ficou inválido, atualiza seleção e zera se esvaziar
        if (filtrados.length !== bairrosSelecionados.length) {
            handleChangeBairros(filtrados.length ? filtrados : null);
        }
    }, [filters.cidades, bairrosSelecionados]);

    if (!active) return null;

    return (
        <div className="flex flex-col flex-grow p-4 w-full">
            <div className="flex flex-row gap-8 pt-4">
                <div className="flex flex-col w-2/4 min-w-fit">
                    <SelectPais
                        id="cd_pais"
                        init
                        label="País"
                        value={filters.cd_pais}
                        onChange={handleChangePais}
                    />
                </div>
                <div className="flex flex-col w-2/4 min-w-fit">
                    <SelectEstado
                        id="estado"
                        label="Estado"
                        cdPais={filters.cd_pais}
                        value={filters.estado}
                        onChange={handleChangeEstado}
                        init
                    />
                </div>
            </div>
            <div className="flex flex-row gap-8 pt-4">
                <div className="flex flex-col w-2/4 min-w-fit">
                    <SelectTailwind
                        id="cidades"
                        value={cidadesSelecionadas} 
                        onChange={handleChangeCidades}
                        options={cidades} 
                        isMultiple={true}
                        isSearchable={true}
                        isClearable={true}
                        noOptionsMessage={"Sem opções"}
                        placeholder={"Escolha as cidades"}
                        searchInputPlaceholder={"Pesquise as cidades aqui"}
                        formatGroupLabel={(data) => (
                            <div className="py-2 text-xs flex items-center justify-between">
                                <span className="font-bold">{data.label}</span>
                                <span className="bg-gray-200 p-1.5 flex items-center justify-center rounded-full">
                                    {data.options.length}
                                </span>
                            </div>
                        )}
                    />

                </div>
                <div className="flex flex-col w-2/4 min-w-fit">
                    <SelectTailwind
                        value={bairrosSelecionados}
                        onChange={handleChangeBairros}
                        options={bairros}
                        isMultiple={true}
                        isSearchable={true}
                        isClearable={true}
                        noOptionsMessage={"Sem opções"}
                        placeholder={
                            bairros.length === 0
                                ? "Escolha uma cidade primeiro"
                                : "Escolha os bairros"
                        }
                        searchInputPlaceholder={"Pesquise os bairros aqui"}
                        formatGroupLabel={(data) => (
                            <div className={`py-2 text-xs flex items-center justify-between`}>
                                <span className="font-bold">{data.label}</span>
                                <span className="bg-gray-200 p-1.5 flex items-center justify-center rounded-full">
                                    {data.options.length}
                                </span>
                            </div>
                        )}
                        isDisabled={bairros.length === 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default FiltroLocalizacao;
