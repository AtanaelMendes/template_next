import { useBuscaCandidatosContext } from "@/context/BuscaCandidatosContext";
import SelectIdiomas from "../inputs/SelectIdiomas";
import LanguageRangeSlider from "../inputs/LanguageRangeSlider";

const FiltroIdiomas = ({ active }) => {
    const {
        filters,
        handleFiltersChange
    } = useBuscaCandidatosContext();

    const handleGenericChange = (id, value) => {
        handleFiltersChange({ target: { name: id, value: value, type: 'generic' } });
    };

    return (
        <div className="flex-1 flex flex-col p-4 w-full rounded-lg ">
            <div className="py-2 border rounded-lg w-full bg-white">
                <div className="flex flex-col w-full gap-4">
                    {/* Seção de seleção de idioma */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                        <div className="w-full md:w-1/2 px-2">
                            <SelectIdiomas
                                id="cd_idioma"
                                label="Selecione um idioma:"
                                value={filters.cd_idioma}
                                onChange={handleGenericChange}
                            />
                        </div>
                    </div>

                    {/* Seção de sliders */}
                    <div className="w-full max-w-4xl mx-auto space-y-4 px-4 sm:px-8 md:px-16">
                        <LanguageRangeSlider
                            value={filters.leitura}
                            id="leitura"
                            label="Leitura:"
                            onChange={handleGenericChange}
                        />
                        <LanguageRangeSlider
                            value={filters.escrita}
                            id="escrita"
                            label="Escrita:"
                            onChange={handleGenericChange}
                        />
                        <LanguageRangeSlider
                            value={filters.fala}
                            id="fala"
                            label="Fala:"
                            onChange={handleGenericChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FiltroIdiomas;
