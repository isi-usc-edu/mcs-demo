import csv
import matplotlib


def statistic():
    scenario = 's5'
    total=0
    roberta=0
    bert=0
    xlnet=0

    #print( bool(1-( a^b )) )
    strmap={'True':True,"False":False}
    evalmap={'1':True,'0':False}
    with open('trials.csv') as csv_file:
        csv_reader=csv.reader(csv_file,delimiter=',')
        # c=0
        # for row in csv_reader:
        #     if c==0:
        #         pass
        #     else:
        #         print(type(row[13]))
        #         exit(0)
        #     c+=1
        i=0
        for row in csv_reader:
            if i>0 and row[4]==scenario:
                total+=1
                pred, evaluation =strmap[row[7]],evalmap[row[29]]
                gt= bool(1-(pred^evaluation))
                if (gt==True and row[10]=='1') or (gt==False and row[10]=='0'):
                    roberta+=1
                if (gt==True and row[13]=='1') or (gt==False and row[13]=='0'):
                    bert+=1
                if (gt==True and row[16]=='1') or (gt==False and row[16]=='0'):
                    xlnet+=1

            else:
                pass
            i+=1

    print("There are total ",total," data in ", scenario)
    print("Correct number for roberta: ",roberta," bert :",bert," xlnet: ",xlnet)
    print("Accuracy of roberta: ",roberta/total, " bert: ",bert/total, " xlnet:",xlnet/total)


def draw():
    pass

if __name__=="__main__":
    statistic()