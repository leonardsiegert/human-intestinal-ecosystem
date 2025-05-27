from taxonomy_ranks import TaxonomyRanks
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv("data_cleaned.csv")
taxa_names = data.columns[7:].values.copy()

# I manually searched the unmatched names via:
# https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=239759&lvl=3&lin=f&keep=1&srchmode=1&unlock
# and changed them to their actual names.
# TODO: Change the misspelled names in main dataset as well
# misspelled:
taxa_names[5] = "Alistipes"
print(data.columns[7:].values[5])
print(taxa_names[5])
taxa_names[70] = "Klebsiella pneumoniae"
taxa_names[71] = "Lachnobacterium bovis"
taxa_names[119] = "uncultured Chlorococcales"
taxa_names[127] = "Weissella"
# my choice of replacement:
# These: 'Outgrouping clostridium cluster XIVa','Uncultured Clostridium (sensu stricto)les I', 'Uncultured Clostridium (sensu stricto)les II'
# had no match. I can replace them by "Clostridium" (leaving us with redundant data!!), or we delete them
taxa_names[88] = "Clostridium"
taxa_names[120] = "Clostridium"
taxa_names[121] = "Clostridium"
# these are higher ranks without genus
taxa_names[122] = "Mollicutes" # was: "Uncultured Mollicutes" - now a class rank
taxa_names[123] = "Selenomonadaceae" # was "Uncultured Selenomonodaceae" - now a family rank


# counts how many had ambiguous ids
several_ids_counter = 0
several_ids_names = []

# counts how many were not found
missing_counter = 0
missing_names = []
missing_indices = []

# empty array prepared for final data
my_data = np.array([])

# loop through all taxa names, find their lineage, fill my_data with lineage
for i in range(len(taxa_names)):
    rank_taxon = TaxonomyRanks(taxa_names[i])
    
    # if it doesn't find the taxid it throws an error, catch that
    try: 
        # find all ids and names
        rank_taxon.get_lineage_taxids_and_taxanames()
        
        # remember those taxa names for which several ids were found
        potential_taxids = rank_taxon.potential_taxids
        if len(potential_taxids) > 1:
            # print("Taxa: ", taxa_names[i] , " had ", len(potential_taxids) , " potential taxids")
            several_ids_counter += 1
            several_ids_names.append(taxa_names[i])

        # ranks = ('kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species')
        ranks = ('phylum', 'class', 'order', 'family', 'genus')
        
        # add the current ranks to the final data
        curr_data = []
        for j, rank in enumerate(ranks):
            rank_name = rank_taxon.lineages[str(potential_taxids[0])][rank]
            curr_data.append(rank_name[0])
        curr_data = np.array(curr_data)[np.newaxis, :]
        if my_data.size == 0:
            my_data = curr_data
        else: 
            my_data = np.concatenate([my_data,curr_data], axis=0)

    except:
        # if the taxon wasn't found, remember it to later look it up online
        missing_counter += 1
        missing_names.append(taxa_names[i])
        missing_indices.append(i)


print("\n", several_ids_counter,
      " of the ", len(taxa_names), " taxa had several ids.")
print("Namely: ", several_ids_names)
print("But I looked them up and for all 3 there are animals with similar rank names, so the default id (0) is right.")

print("\n Couldn't find: ", missing_counter,
      " of the ", len(taxa_names), " taxa.")
print("Namely: ", missing_names)
print("At indices: ", missing_indices)


print("\n Make sure that these dimensions match!")
print("my_data.shape: ", my_data.shape[0])
print("taxa_names.shape: ", taxa_names.shape[0])

# use this code to see which ranks had empty values
# for i, rank in enumerate(ranks):
#     print("\n", rank, " has ", len(np.unique(my_data[:, i])), " unique columns: ", np.unique(my_data[:, i]))

# The kingdom column was entirely empty and there was only 1 entry in species.
# So I decided to omit them from "ranks".

# The dataset contained mostly genus and species taxa, but also higher order
# Species were never recognized, so I imputed the original uncorrected names for compatibility
# with main dataset
# TODO: use corrected names (misspelled ones mainly, but not all corrections) and change them
#       in main dataset also
ranks = list(ranks)
ranks.append("species")
species = data.columns[7:].values[:, np.newaxis]
my_data = np.hstack([my_data,species])


# use this code to see which ranks were missing:
# incomplete_rows = np.unique(np.where(my_data == 'NA')[0])
# print("Indices of incomplete rows: ", incomplete_rows)
# print("Incomplete rows: ", my_data[incomplete_rows])

# Missing rank strategy: replace all missing ranks with the previous (not missing rank).
# impute genus with family
my_data[0][4] = my_data[0][3]
my_data[82][4] = my_data[82][3]
my_data[84][4] = my_data[84][3]
my_data[123][4] = my_data[123][3]
my_data[128][4] = my_data[128][3]
#impute family with genus
my_data[12][3] = my_data[12][4]
my_data[66][3] = my_data[66][4]
# impute everything with the phylum
my_data[65][1] = my_data[65][0]
my_data[65][2] = my_data[65][0]
my_data[65][3] = my_data[65][0]
my_data[65][4] = my_data[65][0]
my_data[118][1] = my_data[118][0]
my_data[118][2] = my_data[118][0]
my_data[118][3] = my_data[118][0]
my_data[118][4] = my_data[118][0]
# impute family and genus with order
my_data[119][3] = my_data[119][2]
my_data[119][4] = my_data[119][2]
#impute order,family and genus with class
my_data[122][2] = my_data[122][1]
my_data[122][3] = my_data[122][1]
my_data[122][4] = my_data[122][1]


# print how many categories of each rank are present in the data
for i, rank in enumerate(ranks):
    print("\n", rank, " has ", len(
        np.unique(my_data[:, i])), " unique columns.")

# merge the data with the ranks
lineage_data = pd.DataFrame(data=my_data, columns = ranks)

# export it as csv
lineage_data.to_csv("lineage_data.csv", sep=',')
