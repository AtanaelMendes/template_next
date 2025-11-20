import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useCallback } from "react";
import Select2Cliente from "@/components/inputs/Select2Cliente";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import NoDataFound from "@/components/Layouts/NoDataFound";
import { Caption } from "@/components/Layouts/Typography";
import Loading from "@/components/Layouts/Loading";
import Select2 from "@/components/inputs/Select2";
import Button from "@/components/buttons/Button";
import Select from "@/components/inputs/Select";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";

const GeraLaudo = ({ active, reload, cdPessoaCandidato }) => {
    const [tipoRelatorio, setTipoRelatorio] = useState("padrao");
    const { toast, user } = useAppContext();
    const [showLoading, setShowLoading] = useState(false);
    const [opcoesCargos, setOpcoesCargos] = useState([]);
    const [cliente, setCliente] = useState({});
    const [testes, setTestes] = useState([]);
    const [cargo, setCargo] = useState([]);

    useEffect(() => {
        if (active) {
            setShowLoading(true);
            getTestesCandidato();
            getListaCargos();
        }
    }, [reload, active]);

    const setDadosCliente = (cdPessoaCliente, nmPessoaCliente) => {
        setCliente({
            value: cdPessoaCliente,
            label: cdPessoaCliente ? `${cdPessoaCliente} - ${nmPessoaCliente}` : "",
        });
    };

    const getTestesCandidato = () => {
        axiosInstance
            .get(`teste/testes-laudo-candidato/${cdPessoaCandidato}`)
            .then(function (response) {
                setTestes(response?.data || []);
            })
            .catch(function (error) {
                toast.error("Não foi possível carregar os testes.");
                console.error(error);
            });
    };

    const getListaCargos = () => {
        axiosInstance
            .get("cargo/lista-cargos")
            .then(function (response) {
                const cargosArray = response.data.map((item, index) => {
                    return { label: item.NM_CARGO, value: item.CD_CARGO };
                });

                setOpcoesCargos(cargosArray || []);
                setShowLoading(false);
            })
            .catch(function (error) {
                toast.error("Não foi possível obter a lista de cargos.");
                setShowLoading(false);
                console.error(error);
            });
    };

    const gerarLaudo = () => {
        let cdPessoa = `cd_pessoa_candidato=${btoa(cdPessoaCandidato)}`;
        let cdUsuario = `&cd_usuario=${btoa(user.user_sip)}`;
        let cdCliente = `&cd_cliente=${cliente.value}`;
        let cdCargo = `&cd_cargo=${cargo}`;
        let tipoRel = `&tipo=${tipoRelatorio}`;
        let marca = `&curriculo_marca=S`;
        let logo = `&curriculo_logo=S`;
        let layout = `&mostrar_layout=1`;
        let showLogo = `&exibir_logo=S`;

        window.open(
            `${process.env.NEXT_PUBLIC_BASE_URL}/saas_api/app/Utils/laudotestes.php?${cdPessoa}${cdUsuario}${tipoRel}${cdCargo}${cdCliente}${showLogo}${marca}${logo}${layout}`,
            "_blank"
        );
    };

    const renderContent = () => {
        if (!testes.length) {
            return (
                <div className="col-span-12">
                    <NoDataFound />
                </div>
            );
        }

        return testes.map((item, index) => {
            return (
                <div className="odd:bg-white even:bg-gray-100 col-span-12 p-1" key={`row_${index}`}>
                    <div className={`grid grid-cols-12 gap-2 text-sm`}>
                        <div className="col-span-5 pl-2 flex items-center">
                            <Caption>Teste:</Caption>
                            <span className="font-semibold pl-2">{item.DS_TESTE}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Caption>Data:</Caption>
                            <span className="font-semibold pl-2">{item.DT_TESTE}</span>
                        </div>
                        <div className="col-span-3 flex items-center">
                            <Caption>Grau teste:</Caption>
                            <span className="font-semibold pl-2">
                                {item.NR_NOTA || item.CD_GRAU_TESTE}
                            </span>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <Caption>Gera laudo:</Caption>
                            <span className="font-semibold pl-2">
                                {item.ID_GERA_LAUDO == "S" ? "Sim" : "Não"}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    if (!active) return null;

    return (
        <div id="gera_laudo" className={`col-span-12 m-4 mt-14 relative`}>
            <Loading active={showLoading} className={"absolute"} />

            <div className={`flex`}>
                <div className={`w-1/3`}>
                    <Select2Cliente
                        maxChars={27}
                        label="Cliente"
                        value={cliente}
                        id="clienteGeraLaudo"
                        onChange={(value, nmCliente) => setDadosCliente(value, nmCliente)}
                    />
                </div>
                <div className={`w-1/3 mx-4`}>
                    <Select2
                        id={"cargo"}
                        value={cargo}
                        label={"Cargo"}
                        hideClearButton
                        options={opcoesCargos}
                        onChange={(id, value) => setCargo(value)}
                    />
                </div>
                <div className={`w-1/3`}>
                    <Select
                        options={[
                            { label: "Padrão", value: "padrao" },
                            { label: "Embraco", value: "embraco" },
                        ]}
                        label={"Tipo"}
                        hideClearButton
                        id={"tipo_relatorio"}
                        value={tipoRelatorio}
                        onChange={(id, value) => setTipoRelatorio(value)}
                    />
                </div>
            </div>

            <div className="my-4">
                <div
                    className={`grid grid-cols-12 max-h-[530px] overflow-y-auto border rounded-lg`}
                >
                    {renderContent()}
                </div>
            </div>

            <div className={`flex justify-center`}>
                <Button
                    buttonType="primary"
                    onClick={() => {
                        gerarLaudo();
                    }}
                >
                    <div className={`flex items-center`}>
                        <FontAwesomeIcon icon={faGear} width="15" height="15" />
                        <span className={"ml-2"}>Gerar laudo</span>
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default GeraLaudo;
